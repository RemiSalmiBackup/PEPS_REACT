import React from 'react'
import { connect } from 'react-redux' 
import { fetchRemarks } from '../actions/remarkAction';
import { fetchCategories } from '../actions/categoryAction';
import { addRemarks } from '../actions/remarkAction';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent'; 
import DialogTitle from '@material-ui/core/DialogTitle'; 
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Pagination from '@material-ui/lab/Pagination';

import Remark from './Remark'
import ListFilter from './ListFilter'
import Ordonneur from './Ordonneur';

class ListRemark extends React.Component {
    componentDidMount() {
        this.props.dispatch(fetchRemarks());
        this.props.dispatch(fetchCategories());
    }

    constructor(props){
        super(props)
        this.state = {
            open: false,
            remark: "",
            location: "",
            filters : [],
            ordre : 1,
            category: 1,
            nbByPage : 10,
            nbPage : Math.ceil(this.props.remarks.allIds.length/10),
            currentPage : 1,
        }
    }

    handleClickOpen = () => {
        this.setState({ open: true }) 
    };
    
    handleChangeLocation = (e) => {
        this.setState({
            location: e.target.value
        })
    }

    refreshNbPage = () => {
        let size = this.props.remarks.allIds.filter(remarkId =>{
                                
            if (this.state.filters.includes(this.props.remarks.byId[remarkId].idCategory) || this.state.filters.length === 0){
                return remarkId
            }
            return null
        }).length

        this.setState({nbPage : Math.ceil(size/this.state.nbByPage)})
    }

    addFilter = (filter) => {
        let newFilters = this.state.filters
        newFilters.push(filter)
        this.setState({filters : newFilters})
        this.goToFirstPage()
        this.refreshNbPage()
    }

    removeFilter = (filter) => {
        let newFilters = this.state.filters
        newFilters.splice(newFilters.indexOf(filter),1)
        this.setState({filters : newFilters})
        this.goToFirstPage()
        this.refreshNbPage()
    }

    ordonner = (ordre) => {
        switch (ordre) {
            case 1:
                //plus entendu
                let entendu = this.props.remarks.allIds.map( id => { return [this.props.remarks.byId[id].encounters.length,this.props.remarks.byId[id].idRemark]})
                entendu.sort().reverse()
                this.props.remarks.allIds=entendu.map(obj =>{return obj[1]})
                break;
            case 2:
                //plus recent
                let recent = this.props.remarks.allIds.map( id => { return [this.props.remarks.byId[id].dateCreation,this.props.remarks.byId[id].idRemark]})
                recent.sort().reverse()
                this.props.remarks.allIds=recent.map(obj =>{return obj[1]})
                break;
    
            default:
                break;
        }
        this.setState({ordre : ordre})
        this.goToFirstPage()
    }

    handleChangeCategory = (e) => {
        this.setState({
            category: e.target.value
        })
    }

    handleChangeRemark = (e) => {
        this.setState({
            remark: e.target.value
        })
    }

    goToFirstPage = (e) => {
        this.setState({ currentPage: 1 })
    }

    handleClose = () => {
        this.setState({ open: false })
    };

    handleClickCreate = () =>{
        this.setState({ open: false })
        let remark = {"remark":this.state.remark, "idCategory" : this.state.category, "location" : this.state.location, "token": sessionStorage.getItem('token')}
        this.props.dispatch(addRemarks(remark));
    }

    handleChangePage = (event, value) => {
        this.setState({ currentPage: value })
        document.getElementsByClassName('section_title')[0].scrollIntoView(true)
    };

    

    render() {
        const { errorRemarks, loadingRemarks,loadingCat, remarks, title, categories } = this.props;
        const isConnected = this.props.auth.isConnected;

        if (errorRemarks) {
          return <div>Error! {errorRemarks.message}</div>;
        }
    
        if (loadingRemarks || loadingCat) {
          return <div>Loading...</div>;
        }

        return(
            <section id={title}>
                <h1 className={"section_title neu-card"}>{title}</h1>
                <div className={"container-fluid dspf responsive"}>
                    <div>
                        <ListFilter type="remark" addFilter={this.addFilter} removeFilter={this.removeFilter}/>
                        <Ordonneur type="remark" ordonner={this.ordonner}/>
                    </div>
                    <div className="fullWidth" style={{marginRight : "15%"}}>
                    <ul>
                        {remarks.allIds.length ? (
                            remarks.allIds.filter(remarkId =>{
                                
                                if (this.state.filters.includes(remarks.byId[remarkId].idCategory) || this.state.filters.length === 0){
                                    return remarkId
                                }
                                return null
                            })
                            .slice(this.state.nbByPage*this.state.currentPage-this.state.nbByPage,this.state.nbByPage*this.state.currentPage)
                            .map(remarkId => {
                                return <li key={remarkId}><Remark remark={remarks.byId[remarkId]} history={this.props.history}></Remark></li>
                            })
                        ) : (
                            <p>There is no remarks</p>
                        )}    
                    </ul>
                    <Pagination count={this.state.nbPage === 0 ? (Math.ceil(this.props.remarks.allIds.length/10)) :(this.state.nbPage)} page={this.state.currentPage} size="large" className="pagination-it" onChange={this.handleChangePage} />
                    </div>
                    
                </div>

                {isConnected ? (
                   <Tooltip title={"New remark"} aria-label={"New remark"} arrow>
                        <Fab aria-label="add" className="fab fab_color" onClick={this.handleClickOpen}>
                            <AddIcon />
                        </Fab>
                    </Tooltip>
               ) : null
               }             
                

                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth={'xl'}>
                    <DialogTitle id="form-dialog-title">New remark</DialogTitle>
                    <DialogContent>
                        <form>
                            <div className="form-group">
                                <label htmlFor="Location">Location</label>
                                <input type="text" className="form-control" id="location" placeholder="Paris" onChange={this.handleChangeLocation}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="Category">Category</label>
                                <select className="form-control selectpicker" data-style="btn btn-link" id="Category" onChange={this.handleChangeCategory}>
                                    {
                                    categories.allIds.map(idCategory => {
                                        if(categories.byId[idCategory].type === "remark"){
                                            return <option key={idCategory} value={idCategory}>{categories.byId[idCategory].lib}</option>
                                        }else{
                                            return null
                                        }
                                    })}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="Remark">Remark</label>
                                <textarea className="form-control" id="Remark" rows="3" onChange={this.handleChangeRemark}></textarea>
                            </div>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClickCreate} color="primary" autoFocus>
                            Create
                        </Button>
                        <Button onClick={this.handleClose} color="secondary" autoFocus>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </section>
        );
      }
}

const mapStateToProps = state => ({
    remarks: state.remarks,
    categories: state.categories,
    loadingRemarks: state.remarks.loading,
    errorRemarks: state.remarks.error,
    loadingCat: state.categories.loading,
    errorCat: state.categories.error,
    auth: state.auth,
});

export default connect(mapStateToProps)(ListRemark)