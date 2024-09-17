from flask import Flask, render_template, request, redirect, url_for

import re
import random

from glitter_sdk.client.lcd import LCDClient
from glitter_sdk.core import Numeric, Coins
from glitter_sdk.key.mnemonic import MnemonicKey

app = Flask(__name__)

class Bottle:
    def __init__(self, id, title, content,poster):
        self.id = id
        self.title = title
        self.content = content
        self.poster = poster

class Reply:
    def __init__(self,id,content,postid,replier):
        self.id=id
        self.content=content
        self.postid=postid
        self.replier=replier


@app.route('/')
def index():
    # 获取所有帖子
    sql = "SELECT * FROM Bottles.posts;"
    db = client.db(mk)
    all_posts = db.query(sql)
    
    # 随机选择 5 个帖子
    if len(all_posts) > 5:
        selected_posts = random.sample(all_posts, 5)
    else:
        selected_posts = all_posts
    
    # 创建 Bottle 对象列表
    bottles = [Bottle(id=post['id'], title=post['title'], content=post['content'].decode("utf-8"), poster=post['poster']) for post in selected_posts]
    
    return render_template('index.html', bottles=bottles)


@app.route('/post/<int:post_id>')
def post_detail(post_id):
    wallet_address = request.args.get('wallet_address', '')
    # print(wallet_address)

    # 从数据库中获取指定 post_id 的帖子数据

    sql = f"SELECT * FROM Bottles.posts WHERE id = {post_id}"
    db = client.db(mk)
    result = db.query(sql)

    if not result:
        return "帖子不存在", 404  # 如果没有找到指定的帖子，返回 404 错误页面

    # 创建 Bottle 对象
    post = result[0]  # 取出查询结果的第一行数据
    
    bottle = Bottle(id=post['id'], title=post['title'], content=post['content'].decode("utf-8"), poster=post['poster'])

    sql = f"SELECT * FROM Bottles.reply WHERE postid = {post_id}"
    db = client.db(mk)
    result = db.query(sql)

    replies=[Reply(r['id'],r['content'].decode("utf-8"),r['postid'],r['replier']) for r in result]
    print(replies)
    print("hehe")
    return render_template('post.html', bottle=bottle,replies=replies,addr=wallet_address)

@app.route('/add_post', methods=['POST'])
def add_post():
    if request.method == 'POST':
        # 获取钱包地址
        wallet_address = request.form.get('wallet_address')
        if not wallet_address:
            return "请连接钱包", 400  # 如果钱包地址为空，返回错误
        
        # 获取帖子标题和内容
        title = request.form.get('title')
        content = request.form.get('content')
        
        if not title or not content:
            return "标题和内容不能为空", 400

        # 获取下一个 id
        sql = "SELECT MAX(id) AS max_id FROM Bottles.posts"
        max_id = db.query(sql)
        print(max_id)
        new_id=max_id[0]['max_id']+1
        
        # 插入数据到数据库
        sql = f"INSERT INTO Bottles.posts (id, title, content, poster) VALUES ({new_id}, '{title}', '{content}', '{wallet_address}')"
        db.sql_exec(sql)
        
        # 重定向到主页或帖子列表页
        return redirect(url_for('index'))

@app.route('/add_comment', methods=['POST'])
def add_comment():


    referrer = request.referrer
    # print(referrer)

    match = re.search(r'[?&]wallet_address=([^&]*)', referrer)
    if match:
        wallet_address = match.group(1)
    else:
        wallet_address = ''
    print("hi"+wallet_address)
    # 从 URL 中提取最后的数字

    # 尝试将其转换为整数
    match = re.search(r'/post/(\d+)', referrer)
    postid = match.group(1)

    if request.method == 'POST':
        # # 获取钱包地址
        # wallet_address = request.form.get('wallet_address')
        # if not wallet_address:
        #     return "请连接钱包", 400  # 如果钱包地址为空，返回错误
        content = request.form.get('reply')

        # 获取下一个 id
        sql = "SELECT MAX(id) AS max_id FROM Bottles.reply"
        try:
            max_id = db.query(sql)
            print(max_id)
            new_id=max_id[0]['max_id']+1
        except:
            new_id=1


        # 插入数据到数据库
        sql = f"INSERT INTO Bottles.reply (id , content , postid , replier) VALUES ({new_id}, '{content}', '{postid}', '{wallet_address}')"
        print(sql)
        rsp=db.sql_exec(sql)
        print(rsp)
        # 重定向到主页或帖子列表页
        return redirect(request.referrer)



XIAN_HOST = "https://api.xian.glitter.link"
CHAIN_ID = "glitter_12000-2"
mk = MnemonicKey(
    "gate cry field update filter thumb crouch hard please inside neglect suffer"
)
client = LCDClient(
    chain_id=CHAIN_ID,
    url=XIAN_HOST,
    gas_prices=Coins.from_str("1agli"),
    gas_adjustment=Numeric.parse(1.5))
db = client.db(mk)

if __name__ == '__main__':
    app.run(debug=True)
