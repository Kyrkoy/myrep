const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
const Skill = mongoose.model('Skill');
const helpers = require('handlebars-helpers');
const exphbs = require('express-handlebars');
const handlebars = exphbs.handlebars;


mongoose.set('runValidators', true);
mongoose.set('useFindAndModify', false);




/*This get is called when the Site is initialized */

router.get('/',(req,res)=>{
        Employee.find((err,docs) => {    
            res.render("main/mainPage",{
                viewTitle : "Insert Employee",
                list: docs
        });
    });
});




/*This get is called when a Back button is clicked */

router.get('/mainPage',(req,res)=>{
    Employee.find((err,docs) => {  
        Skill.find((err,syms) => {
            res.render("main/mainPage",{
                viewTitle : "Insert Employee",
                list: docs,
                skillList: syms
        })
    });
});
});





/*This get renders the skill Option page where the user can choose between Creating a new Skill or Updating an existing one */

router.get('/skillMain',(req,res)=>{  
        res.render("main/skillMain");
});





/*This post inserts data to the Skills database collection */

router.post('/skillEdit',(req,res)=>{
    if (req.body._id ==''){
        insertSkill(req,res);
    }
    else
        updateSkill(req,res);
});



/*This post inserts data to the Employees database collection */

router.post('/employeeEdit',(req,res)=>{
    if (req.body._id =='')
        insertRecord(req,res);
    else
        updateRecord(req,res);
});






/*This function is used to insert user inputs to a new skill's attributes and redirects to the display list */

function insertSkill(req,res){
    var skill = new Skill();
    skill.name = req.body.name;
    skill.description = req.body.description;
    skill.created = Date.now();
    skill.save((err,doc)=> {
        if(!err)
            res.redirect('/skillList');
        else {
            if(err.name == 'ValidationError'){
                handleValidationError(err,req.body);
                res.render("main/skillEdit",{
                    viewTitle : "Insert Skill",
                    skill: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}





/*This function is used to update a skill's attributes with new user inputs and then redirects to the display list */

function updateSkill(req,res) {
    mongoose.set('useFindAndModify',false);
    Skill.findOneAndUpdate({ _id: req.body._id}, req.body,  { new:true }, (err,doc) => {
        if (!err) {res.redirect('/skillList');}
        else{
            if(err.name=='ValidationError'){
                handleValidationError(err,req.body);
                res.render("main/skillEdit", {
                    viewTitle: 'Modify Skill',
                    skill: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}





/*This function is used to insert user inputs to a new employee's attributes and then redirects to the display list */

function insertRecord(req,res){
    var employee = new Employee();
    var skill = new Skill();
    employee.firstName = req.body.firstName;
    employee.lastName = req.body.lastName;
    employee.email = req.body.email;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;
    employee.skill = req.body.skill;
    employee.save((err,doc)=> {
        if(!err)
            res.redirect('/list');
        else {
            if(err.name == 'ValidationError'){
                handleValidationError(err,req.body);
                res.render("main/employeeEdit",{
                    viewTitle : "Insert Employee",
                    employee: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}




/*This function is used to update an employee's attributes with new user inputs and then redirects to the display list */

function updateRecord(req,res) {
    mongoose.set('useFindAndModify',false);
    Employee.findOneAndUpdate({ _id: req.body._id}, req.body,  { new:true }, (err,doc) => {
        if (!err) {res.redirect('/list')}
        else{
            if(err.name=='ValidationError'){
                handleValidationError(err,req.body);
                res.render("main/employeeEdit", {
                    viewTitle: 'Update Employee',
                    employee: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
            
            
            
            


    });
}





/*This get displays the skill list when called and sorts them by name */

router.get('/skillList',(req,res) =>{
    Skill.find({}).sort('name').exec(function(err,docs){
        if(!err){
            res.render("main/skillList", {
                skillList: docs
            })
        }
        else{
            console.log('Error in retrieving employee list :' + err);
        }
    });
})





/*This get displays the skill list when called and sorts them by name */

router.get('/skillEdit',(req,res) =>{
    Skill.find((err,docs) => {
        if(!err){
            res.render("main/skillEdit", {
                viewTitle: 'Insert Skill'
            });
        }
        else{
            console.log('Error in retrieving skill list :' + err);
        }
    });
})





/*This get displays the employee list when called and sorts them by last name */

router.get('/list',(req,res) =>{
    Employee.find({}).sort('lastName').exec(function(err,docs){
        if(!err){
            res.render("main/list", {
                list: docs
            })
        }
        else{
            console.log('Error in retrieving employee list :' + err);
        }
    });
})





/*This get renders the employee Option page where the user can choose between Creating a new Employee or Updating an existing one */

router.get('/employeeMain',(req,res) =>{
    res.render("main/employeeMain");
})


router.get('/employeeEdit',(req,res) =>{
    Employee.find((err,syms) => {
        Skill.find((err,docs) => {
            if(!err){
                res.render("main/employeeEdit", {
                    viewTitle: 'Insert Employee',
                    list: syms,
                    skillList: docs
                })
            }
            else{
                console.log('Error in retrieving employee list :' + err);
            }
        });  
    });
})




/*This function handles any input errors when a skill/employee is created/updated */

function handleValidationError(err,body){
    for(field in err.errors)
    {
        switch (err.errors[field].path){
            case 'firstName':
                body['firstNameError'] = err.errors[field].message;
                break;
            case 'lastName':
                body['lastNameError'] = err.errors[field].message;
                break;
            case 'name':
                body['nameError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}




/*This get finds an Employee and displays their information so they can be modified */

router.get('/:id',(req,res)=> {
    Employee.findById(req.params.id, (err, doc) =>{
        Skill.find((err, syms) =>{
            if(!err) {
                res.render("main/employeeEdit", {
                    viewTitle: "Update Employee",
                    employee: doc,
                    skillList: syms
                });
            }
        });
    });
});



/*This get finds a Skill and displays its details so they can be modified */

router.get('/skill/:id',(req,res)=> {
    Skill.findById(req.params.id, (err, doc) =>{
        if(!err) {
            res.render("main/skillEdit", {
                viewTitle: "Modify Skill",
                skill: doc
            });
        }
    });
}); 




/*This deletes an Employee */

router.get('/delete/:id', (req,res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if(!err) {
            res.redirect('/list');
        }
        else{
            console.log('Error in employee delete :' + err);
        }
    });
})


/*This get deletes a Skill */

router.get('/skill/delete/:id', (req,res) => {
    Skill.findByIdAndRemove(req.params.id, (err, doc) => {
        if(!err) {
            res.redirect('/skillList');
        }
        else{
            console.log('Error in skill delete :' + err);
        }
    });
})

module.exports = router;