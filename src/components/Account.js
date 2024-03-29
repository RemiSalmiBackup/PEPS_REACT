import React from 'react';
import axios from 'axios'
import { checkLogin } from '../actions/authAction'; 
import { deleteUser } from '../actions/userAction';
import Footer from './Footer'
import { connect } from 'react-redux' 
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { NavLink } from 'react-router-dom';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
var jwt = require('jsonwebtoken');

class Account extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            pass1: "",
            pass2: "",
            alert: ""
        }
    }

    openAlert = (alert) => {
        this.setState({
            alert : alert,
            open: true
        })
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        this.setState({
            open: false
        })
    };

    componentDidMount(){
    }

    handleDelete =() => {
        this.props.dispatch(deleteUser(jwt.decode(sessionStorage.getItem('token')).idUser,sessionStorage.getItem('token')));
        sessionStorage.removeItem('token')
        this.props.dispatch(checkLogin());
    }

    handleChangePass1 = (e) => {
        this.setState({
            pass1: e.target.value
        })
    }

    handleChangePass2 = (e) => {
        this.setState({
            pass2: e.target.value
        })
    }

    handleChangePassword = (e) =>{
        e.preventDefault()
        let idUser = jwt.decode(sessionStorage.getItem('token')).idUser
        if (this.state.pass1 === this.state.pass2) {
            axios.put('https://web-ios-api.herokuapp.com/users/'+idUser, {'password':this.state.pass1,'token': sessionStorage.getItem('token')})
            .then(response => {
                this.openAlert("Password modifié")
            })
            .catch(error => {
                this.openAlert("erreur")
            })
        }else{
            this.openAlert("Password differents")
        }
    }

    render(){
        return (
    
            <div style={{position: "absolute",height:"100%", width:"100%"}}>
                <section id="Account" className="">
                    <div className={"container"} >
                        <div className="row loginBox " >
                        <div className="card margin-center neu-card ">
                            <div className="container loginFlex">
                                <h1>My Account</h1>
                                <NavLink onClick={this.handleDelete} class="text-primary" to="/">Delete my account</NavLink>
                                <form>
                                <h2>Change my password</h2>
                                <div className="input-group">
                                        <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <i className="material-icons">lock</i>
                                        </span>
                                        </div>
                                        <input type="password" className="form-control" id="password1" placeholder="New Password" onChange={this.handleChangePass1}/>
                                    </div>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <i className="material-icons">lock</i>
                                        </span>
                                        </div>
                                        <input type="password" className="form-control" id="password2" placeholder="Confirm New Password" onChange={this.handleChangePass2}/>
                                    </div>

                                    <div className="form-group loginFlex">
                                    <button type="submit" className="btn btn-primary" style={{marginTop:"30px"}} onClick={this.handleChangePassword}>Change</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        </div>
                    </div>
                    <Snackbar open={this.state.open} autoHideDuration={6000} onClose={this.handleClose} anchorOrigin={{ vertical:"top", horizontal:"center"}}>
                        <Alert onClose={this.handleClose} severity={this.state.alert === "Password modifié" ? ("success"):("error")}>
                            {this.state.alert}
                        </Alert>
                    </Snackbar>
                </section>
                <Footer style={{position: "fixed",bottom:"0px", left:"0px", width:"100%"}}/>  
            </div>
         );
    }
    
}


const mapStateToProps = state => ({
    users: state.users,
    categories: state.categories,
});
export default connect(mapStateToProps)(Account);
