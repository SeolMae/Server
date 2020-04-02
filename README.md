# Server
>2018년 서울시 앱 공모전 출품작(할애)

할애(할愛)는 독거노인의 외로움 문제를 해결하기 위한, **독거노인과 자원봉사자 1:1 매칭 서비스**입니다.

---

#### 서울메이트 팀
* 박선희, 신예지, 양시연, 이선영, 최고운

## Using
* Node.js
* express.js
* AWS infra(RDS, EC2, SSL, S3)
* RestFul API ```JSON 형식으로 End Point에 뿌려줌.``` (Swagger API)

* 웹페이지와 연동 시에만 , ```var cors = require('cors'); app.use(cors());``` 로 cors 설정
</br></br>

## Screen Shot

## Setting
**config/ 폴더 생성 후, 아래의 4개 파일**

1. dbPool.js
```node.js
var mysql = require('promise-mysql')

const dbConfig = {
    host : '',
    port : '',
    user : '',
    password : '',
    database : '',
    connectionLimit : 20
 };

module.exports = mysql.createPool(dbConfig);
```

2. awsConfig.json
```node.js
{
	"accessKeyId": "",
	"secretAccessKey" : "",
	"region" : "ap-northeast-2"
}
```

3. multer.js
```node.js
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
aws.config.loadFromPath('./config/awsConfig.json');

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: '',
        acl: 'public-read',
        key: function(req, file, cb) {
            cb(null, Date.now() + '.' + file.originalname.split('.').pop());
        }
    })
});

module.exports = upload;
```

4. secretKey.js
```node.js
module.exports = {
    secret : "(Anykey you want)"
}
```

</br></br>
## Build
```
git clone https://github.com/Weatherook/server
cd server
npm config package-lock false //package-lock 생성 못하게 필요시에
npm start
```

*integrity checksum failed 오류가 나는 경우* **npm cache clean --force 실행**

</br></br>
## Nginx 설정
**웹서버 접속 후, 진행**
1. sudo apt update -y && sudo apt-get install nginx -y
</br>
2. sudo systemctl status nginx
</br>
3. sudo systemctl start nginx , sudo systemctl enable nginx
</br>
4. Nginx 설정파일 수정 ```sudo vi /etc/nginx/sites-available/defalut```

```javascript
server{
	listen 8080;
	sever_name ip;
	location /{
	 proxy_pass http://ip:포트번호;
	 proxy_http_version 1.1;
	 proxy_set_header Upgrade $http_upgrade;
	 proxy_set_header Connection 'upgrade';
	 proxy_set_header Host $host;
	 proxy_cache_bypass $http_upgrade;
	}
	location /public{
	 root /usr/loca/var/www;
	}
     } 
server {
      listen 80;

      server_name ip;

      ## redirect http to https ##
      rewrite (path 정규식 표현으로);

}
```
</br>
5. sudo service nginx restart

#### 문의
* 메일: mn04098@naver.com
