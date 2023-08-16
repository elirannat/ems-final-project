const serverless = require('serverless-http');
const express = require('express')
const app = express()
const morgan = require("morgan");
const bodyParser = require("body-parser");
const CONSTANTS = require("./api/config/constants");
const multer = require('multer');
// const upload = require('./api/middleware/multerMiddleware')
const uploads = multer();
const Company = require('./api/model/Company');
const Holiday = require('./api/model/Holiday')
const Users = require('./api/model/Users');
const MasterLeave = require('./api/model/MasterLeave')
const Appraisal = require('./api/model/Appraisal')
const CompanyLeave = require("./api/model/CompanyLeave")
const MasterSalary = require('./api/model/MasterSalary')
const CompanySalary =require('./api/model/CompanySalary')
const BankAccount = require('./api/model/BankAccount')
const Role =require('./api/model/Role')
const Permission =require('./api/model/Permission')
// const uploadRoutes = require('./api/routes/api')
// const uploadRoutes = require('./api/routes/uploadRoutes')
// const checkPermission = require('./api/middleware/checkPermission');

const mongooseConnect = require('./db');

const OAuth2Server = require('oauth2-server'),
    Request = OAuth2Server.Request,
    Response = OAuth2Server.Response;

app.oauth = new OAuth2Server({
    model: require('./api/middleware/oauth/oauthModel.js'),
    grants: CONSTANTS.OAUTH.ALLOWED_GRANTS,
    debug: true,
    accessTokenLifetime: CONSTANTS.OAUTH.ACCESS_TOKEN_LIFETIME,
    refreshTokenLifetime: CONSTANTS.OAUTH.REFRESH_TOKEN_LIFETIME,
    alwaysIssueNewRefreshToken: true,
});

app.use(morgan('dev'));
// app.use(uploads.any());
// app.use(uploads.fields());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

////////////////////////////////////Store initial Data////////////////////////////////////
const initialDataRoutes = require('./api/routes/initialData');
app.use('/initial', initialDataRoutes);
////////////////////////////////////Store initial Data////////////////////////////////////

const OAuthController = require('./api/middleware/oauth/authController');
const apiRoutes = require('./api/routes/api');
app.post(CONSTANTS.ROUTES.LOGIN, obtainToken, OAuthController.login);
app.all(CONSTANTS.ROUTES.REFRESH_TOKEN, obtainToken, OAuthController.getRefreshToken);

app.use('/', authenticateRequest, apiRoutes);

app.use((req, res, next) => {
    const error = new Error('Error 404: Not found');
    error.code = CONSTANTS.API.FAIL_CODE;
    error.status = CONSTANTS.API.DEFAULT_STATUS_CODE;
    next();
    //next(error)
}); 

app.use((error, req, res, next) => {
    res.status(CONSTANTS.API.DEFAULT_STATUS_CODE).json({
        res_code: error.code || CONSTANTS.API.FAIL_CODE,
        res_message: error.message,
        res_data: []
    });
});

module.exports.handler = serverless(app);

function obtainToken(req, res, next) {
    var request = new Request(req);
    var response = new Response(res);
    return app.oauth.token(request, response)
        .then(function (token) {
            req.body.token = {
                accessToken: token.accessToken,
                tokenType: 'Bearer',
                accessTokenExpiresAt: token.accessTokenExpiresAt,
                refreshToken: token.refreshToken,
                refreshTokenExpiresAt: token.refreshTokenExpiresAt,
            };
            req.body.loggedUserId = token.user.id;
            next();
        }).catch(function (err) {
            const error = new Error(err.message);
            error.code = CONSTANTS.API.FAIL_CODE;
            error.status = CONSTANTS.API.DEFAULT_STATUS_CODE;
            next(error);
        });
}

function authenticateRequest(req, res, next) {
    var request = new Request(req);
    var response = new Response(res);
    return app.oauth.authenticate(request, response)
        .then(function (token) {
            req.body.loggedUserId = token.user._id;
            next();
        }).catch(function (err) {
            const error = new Error(err.message);
            error.code = CONSTANTS.API.FAIL_CODE;
            error.status = CONSTANTS.API.DEFAULT_STATUS_CODE;
            next(error);
        });
}

// upload Section
const upload = multer({
    storage: multer.diskStorage({
      destination: function(req, file, cb) {
        console.log(file)

        console.log(file)

        cb(null, 'uploads');
      },
      filename: function(req, file, cb) {
        console.log(file)

        console.log('filename call',file)
        cb(null, `${Date.now()}-${file.originalname}`);
      },
      fileFilter: function(req, file, cb) {
        console.log(req)

        console.log('file filter call',file) 
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
          return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
      }
    }) 
  }).single('images');
  
  app.post('/imageupload', upload, (req, res) => {
    console.log(req)
    res.json({ message: 'Image Upload Successfully' });
  }); 
  
  
// const fileUploadMiddleware  = multer({
//     storage: multer.diskStorage({
//         destination: function(req, file, cb) {
//             console.log(file)
//             cb(null, 'uploads');
//         },
//         filename: function(req, file, cb) {
//             console.log(file)
//             cb(null, `${Date.now()}-${file.originalname}`);
//         }
//     })
//     ,
//     fileFilter: function(req, file, cb) {
//         console.log(file)
//         if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/gif') {
//             return cb(new Error('Only image files are allowed!'));
//         }
//         cb(null, true);
//     }
// }).single('images');
// const upload = multer({
//     storage:multer.diskStorage({
//         destination:function(req,file,cb){
//             console.log(file)
//             cb(null,'/uploads')
//         }
//         ,
//         filename:function(req,file,cb){
//             console.log(file)
//             cb(null, `${Date.now()}-${file.originalname}`)
//         },
        
//         fileFilter: function(req, file, cb) {
//             console.log(file)
//             if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
//               return cb(new Error('Only image files are allowed!'))
//             }
//             cb(null, true)
//           }
//     })
// }).single('images')


// app.post('/imageupload', upload , (req, res) => {
//     const file = req.file
//     console.log(file)
//     try {
//         console.log('This is req.file')
//         console.log(req.body)
//         if (!req.file) {
//             // no image file selected
//             res.status(400).send('Please select an image for upload');
//         } else {
//             // image file selected and uploaded successfully
//             console.log('Upload successful!');
//             // res.send('Image uploaded successfully');
//             res.send(`Image uploaded successfully: ${req.file.filename}`);

//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal server error');
//     }
// });

app.post('/editcompanyid/:id',async(req,resp)=>{
    console.log("editcompany/:id is called")
    let result = await Company.findOne({_id:req.params.id})
    if(result){
        resp.send(result)
    }else{
        resp.send({result:"No record Found"})
    }
})
app.post('/edituserid/:id',async(req,resp)=>{
    let result = await Users.findOne({_id:req.params.id})
    if(result){
        resp.send(result)
    }else{
        resp.send({result:"No record Found"})
    }
})
app.post('/editemployeeid/:id',async(req,resp)=>{
    let result = await Users.findOne({_id:req.params.id})
    if(result){
        resp.send(result)
    }else{
        resp.send({result:"No record Found"})
    }
})
app.post('/editleaveid/:id',async(req,resp)=>{
    let result = await MasterLeave.findOne({_id:req.params.id})
    if(result){
        resp.send(result)
    }else{
        resp.send({result:"No record Found"})
    }
})
app.post('/editcompanyleaveid/:id',async(req,resp)=>{
    let result = await CompanyLeave.findOne({_id:req.params.id})
    if(result){
        resp.send(result)
    }else{
        resp.send({result:"No record Found"})
    }
})
app.post('/editcompanyholidayid/:id',async(req,resp)=>{
    let result = await Holiday.findOne({_id:req.params.id})
    if(result){
        resp.send(result)
    }else{
        resp.send({result:"No record Found"})
    }
})
app.post('/editcompanysalaryid/:id',async(req,resp)=>{
    let result = await CompanySalary.findOne({_id:req.params.id})
    if(result){
        resp.send(result)
    }else{
        resp.send({result:"No record Found"})
    }
})
app.post('/editappraisalid/:id',async(req,resp)=>{
    let result = await Appraisal.findOne({_id:req.params.id})
    if(result){
        resp.send(result)
    }else{
        resp.send({result:"No record Found"})
    }
})
app.post('/editroleid/:id',async(req,resp)=>{
    let result = await Role.findOne({_id:req.params.id})
    if(result){
        resp.send(result)
    }else{
        resp.send({result:"No record Found"})
    }
})
app.post('/editpermissionid/:id',async(req,resp)=>{
    let result = await Permission.findOne({_id:req.params.id})
    if(result){
        resp.send(result)
    }else{
        resp.send({result:"No record Found"})
    }
})
app.post('/editsalaryid/:id',async(req,resp)=>{
    let result = await MasterSalary.findOne({_id:req.params.id})
    if(result){
        resp.send(result)
    }else{
        resp.send({result:"No record Found"})
    }
})
app.post('/editbankaccountid/:id',async(req,resp)=>{ 
    let result = await BankAccount.findOne({_id:req.params.id})
    if(result){
        resp.send(result)
    }else{
        resp.send({result:"No record Found"})
    }
})
app.post('/companybyemail/:email',async(req,resp)=>{ 
    let result = await Company.findOne({email:req.params.email})
    if(result){
        resp.send(result)
    }else{
        resp.send({result:"No record Found"})
    }
})
