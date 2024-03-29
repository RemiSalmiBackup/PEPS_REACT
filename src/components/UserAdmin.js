import React from 'react';
import { connect } from 'react-redux'

import { deleteUser, addUser, updateUser, updateUserRole } from '../actions/userAction';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent'; 
import Button from '@material-ui/core/Button';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Key from '@material-ui/icons/VpnKey';
import Supervisor from '@material-ui/icons/SupervisorAccount';
import Stars from '@material-ui/icons/Stars';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';

class AnswerAdmin extends React.Component{
    componentDidMount(){
    }

    constructor(props){
        super(props)
        this.state = {
            open: false,
            openDialog: false,
            dialogAction: "",
            userId: "",
            pseudo: "",
            password: "",
            password2: "",
            role: "",
        }
    }

    handleCreate = () => {
        let user = {"pseudo": this.state.pseudo, "password":this.state.password}
        this.props.dispatch(addUser(user,sessionStorage.getItem('token')))
        this.handleClose()
    }
    
    handleUpdate = () => {
        if(this.state.password === this.state.password2){
            this.props.dispatch(updateUser(this.state.userId,this.state.password,sessionStorage.getItem('token')))
        }
        this.handleClose()
    };

    handleDelete = () =>{
        this.props.dispatch(deleteUser(this.state.userId,sessionStorage.getItem('token')))
        this.handleClose()
    };

    handleRight = event =>{
        let newRole = event.currentTarget.value
        this.props.dispatch(updateUserRole(this.state.userId,newRole,sessionStorage.getItem('token')))
        this.handleClose()
    };

    handleConfirmDelete = event => {
        this.setState({openDialog: true, dialogAction: "delete", userId: event.currentTarget.value})
    };

    
    handleConfirmUpdate = event => {
        let userObj = this.props.users.byId[event.currentTarget.value]
        this.setState({
            openDialog: true,
            dialogAction: "update",
            userId: event.currentTarget.value,
            pseudo: userObj.pseudo
        })
    };

    handleConfirmCreate = () => {
        this.setState({openDialog:true, dialogAction: "create"})
    }

    handleConfirmAccessRight = event => {
        let userObj = this.props.users.byId[event.currentTarget.value]
        this.setState({openDialog:true,
            dialogAction: "accessRights",
            userId:  event.currentTarget.value,
            role: userObj.role
        })
    }

    handleClose = () => {
        this.setState({ openDialog: false })
    };

    handleChangePseudo = event => {
        this.setState({pseudo: event.target.value})
    }

    handleChangePassword = event => {
        this.setState({password: event.target.value})
    }

    handleChangePassword2 = event => {
        this.setState({password2: event.target.value})
    }

    handleChangeRole = event => {
        this.setState({role: event.currentTarget.value})
    }

    render(){

        const { users } = this.props;
        var dialogContent, dialogActions;



        

        if (this.state.dialogAction === "delete"){
            dialogContent = (
                <DialogContent>
                    <div>Are you sure to delete this user ?</div>
                </DialogContent>
            )

            dialogActions = (
                <DialogActions>
                    <Button variant="outlined" color="default" autoFocus onClick={this.handleClose}>
                        Cancel
                    </Button>
                    <Button variant="outlined" color="secondary" autoFocus onClick={this.handleDelete}>
                        Delete
                    </Button>
                </DialogActions>
            )
        }else if(this.state.dialogAction === "update"){
            dialogContent = (
                <DialogContent>
                    <form>
                        <div className="form-group">
                            <label htmlFor="Password">Password</label>
                            <input className="form-control" id="password" type="password" onChange={this.handleChangePassword}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="Password2">Check Password</label>
                            <input className="form-control" id="password2" type="password" onChange={this.handleChangePassword2}/>
                        </div>
                    </form>
                </DialogContent>
            )

            dialogActions = (
                <DialogActions>
                    <Button variant="outlined" color="default" autoFocus onClick={this.handleClose}>
                        Cancel
                    </Button>
                    <Button variant="outlined" color="primary" autoFocus onClick={this.handleUpdate}>
                        Update
                    </Button>
                </DialogActions>
            )
        }else if(this.state.dialogAction === "create"){
            dialogContent = (
                <DialogContent>
                    <form>
                        <div className="form-group">
                            <label htmlFor="Pseudo">Pseudo</label>
                            <input type="text" className="form-control" id="pseudo" placeholder="JohnDoe" onChange={this.handleChangePseudo}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="Password">Password</label>
                            <input className="form-control" id="password" type="password" onChange={this.handleChangePassword}/>
                        </div>
                    </form>
                </DialogContent>
            )
            dialogActions = (
                <DialogActions>
                    <Button variant="outlined" color="default" autoFocus onClick={this.handleClose}>
                        Cancel
                    </Button>
                    <Button variant="outlined" color="primary" autoFocus onClick={this.handleCreate}>
                        Create
                    </Button>
                </DialogActions>
            )
        }else if(this.state.dialogAction === "accessRights"){
            var newRight;
            if(this.state.role === "user"){
                dialogContent = (
                    <DialogContent>Turn this user administrator ?</DialogContent>
                )
                newRight="admin"
            }else if(this.state.role === "admin"){
                dialogContent = (
                    <DialogContent>Remove administrator rights from this user?</DialogContent>
                )
                newRight="user"
            }
            dialogActions = (
                <DialogActions>
                    <Button variant="outlined" color="default" autoFocus onClick={this.handleClose}>
                        Cancel
                    </Button>
                    <Button variant="outlined" color="primary" autoFocus value={newRight} onClick={this.handleRight}>
                        Yes
                    </Button>
                </DialogActions>
            )
        }

        return(

            <div>
            <Button variant="contained" color="default" endIcon={<AddIcon/>} onClick={this.handleConfirmCreate}>New User</Button>
            <TableContainer component={Paper}>
                <Table aria-label="customized table">
                    <TableHead>
                    <TableRow>
                        <TableCell>User ID</TableCell>
                        <TableCell align="right">Pseudo</TableCell>
                        <TableCell align="right">Role</TableCell>
                        <TableCell align="right">Password</TableCell>
                        <TableCell align="right">Access</TableCell>
                        <TableCell align="right">Delete</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {users.allIds.length ? (
                        users.allIds.map(userId => (
                            <TableRow key={userId}>
                            <TableCell component="th" scope="row">
                                {userId}
                            </TableCell>
                            <TableCell align="right">{users.byId[userId].pseudo}</TableCell>
                            <TableCell align="right">{users.byId[userId].role} {users.byId[userId].role === "admin" &&  <Stars/> }</TableCell>
                            <TableCell align="right">
                                <IconButton aria-label="update" value={userId} onClick={this.handleConfirmUpdate}>
                                    <Key/>
                                </IconButton>
                            </TableCell>
                            <TableCell align="right">
                                <IconButton value={userId} onClick={this.handleConfirmAccessRight}>
                                    <Supervisor/>
                                </IconButton>
                            </TableCell>
                            <TableCell align="right">
                                <IconButton edge="end" aria-label="delete" value={userId} onClick={this.handleConfirmDelete}>
                                    <DeleteIcon color="secondary"/>
                                </IconButton>
                            </TableCell>
                            
                            </TableRow>
                        ))
                    ):(
                        <TableRow>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right">No users to handle</TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    )
                    }
                    </TableBody>
                </Table>
                </TableContainer>

                <Dialog open={this.state.openDialog} onClose={this.handleClose} aria-labelledby="form-dialog-title"  maxWidth={'xl'}>
                    {dialogContent}
                    {dialogActions}
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    users: state.users
});

export default connect(mapStateToProps)(AnswerAdmin);