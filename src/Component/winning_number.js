import React, { Component } from 'react'
import "./style-sheet/user.css"
import Axios from 'axios';
import {Grid,Paper} from '@material-ui/core';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import history from '../history';
import CustomizedInputs from './Input/Input';
import moment from 'moment';
import { DatePicker, Space } from 'antd';

class WinnginNumber extends Component {
    constructor(props) {
        super(props)
        this.today = moment().format('YYYY-MM-DD')
        this.state = {
            ticket_name: '',
            winning_number: '',
            show_time: '11:00 AM',
            gender: 'Male',
            ticketNames : [],
            win_number_list : [],
            tickets : [],
            nameError: '',
            emailError: '',
            phoneError: '',
            message: '',
            searchName: "",
            input:"",
            btnDisable: true,
        }
    }

    componentDidMount = () => {
            Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/master`).then((response) => {              
                this.setState({ ticketNames: response.data.data.attributes.data, tickets : response.data.data.attributes.data })            
            }).catch((err) => {
        });
        this.getWinList()
    }

    getWinList = () => {
        Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/purchase/winning-announcement?date=${this.today}&&show_time=${this.state.show_time}`).then((response) => {           
            this.setState({win_number_list : response.data.data.attributes.data})
                console.log(response.data.data.attributes.data)
            }).catch((err) => {
        });
    }

    handleText = event => {
        this.setState({ name: event.target.value })
    }
    handleEmailText = (event) => {
        this.setState({ email: event.target.value })
    }
    handlePhoneText = (event) => {
        this.setState({ phone: event.target.value })
    }
    handleSelection = (event) => {
        this.setState({ gender: event.target.value })
    }
    handleSearch = (event) => {
        this.setState({ searchName: event.target.value })
    }

    viewUser = () => {
        history.push('/view-users')
    }

    addWinNumber = (event) => {
        this.state.tickets.map((item, index) => {
            console.log(item)
            let data = Object.assign({
                data: {
                    attributes: {
                        //ticket: item.name,
                        ticket : item._id,
                        winning_number: item.winning_number,
                        show_time: this.state.show_time,
                        date: this.today
                    }
                }
            })
            return Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/purchase/winning-announcement`, data).then((response) => {
                this.setState({ message: response.data.data.attributes.message, pagenation: true });
                if(index == this.state.tickets.length-1){
                    toast.success(this.state.message);
                    this.setState({btnDisable : true});
                }
            }).catch((err) => {
                this.setState({ message: err.response.data.data.attributes.message })
                return toast.error(this.state.message);
            });
        })           
    }    

    handleShowTimeSelection = (event) => {
        this.setState({ show_time: event.target.value, controll: false },()=>{
            this.getWinList()
        })
    }
   
    handleWinNum = (e, item) => {  
        this.setState({
            tickets: this.state.tickets.map(el => (el.name === item.name ? Object.assign({}, el, { "winning_number" : e.target.value }) : el))
        },()=>{
            let disable = false;
            this.state.tickets.map(item => {                
                if(!item.winning_number){
                    const win_number = this.state.win_number_list.filter(x=>x.ticket.name == item.name);
                    if(win_number.length == 0){
                        disable = true
                    }
                    else{
                        this.state.tickets.map(el => (el.name === item.ticket.name ? Object.assign({}, el, { "winning_number" : item.winning_number }) : el))
                    }
                }
            })
            this.setState({
                btnDisable : disable
            })
        });      
    }

    onChange = (e) => {
        this.setState({input : e.target.value})
    }

    render() {
       const {winning_number, ticket_name, show_time, date, ticketNames} = this.state;
        return (
            <div>           
            <Grid style={{padding:12}} container direction="row" justify="center" alignItems="center">
                <Grid item xs={12} sm={12} md={5}>
                    <h4>Add Winning Number</h4>
                    <Paper style={{border : '1px solid #cccccc5c'}}>                   
                    <div className="ticket-form">                        
                        <div className="form-outline" style={{marginBottom:20}}>
                            <DatePicker className="form-control datePicker" disabled={true} defaultValue={moment(this.today, 'YYYY-MM-DD')} format={'YYYY-MM-DD'} onChange={this.dataPicker} />
                        </div>
                        <div className="form-outline">
                        <select className="select-box" value={show_time} onChange={this.handleShowTimeSelection}>
                                <option value="11:00 AM"> 11:00 AM</option>
                                <option value="02:00 PM"> 02:00 PM</option>
                                <option value="05:00 PM"> 05:00 PM</option>
                                <option value="08:00 PM"> 08:00 PM </option>
                            </select>
                        </div>  
                        </div>
                    </Paper>
                </Grid>                
            </Grid>     
            <Grid style={{padding:6}} container direction="row" justify="center" alignItems="center">
            <Grid item xs={12} sm={8} md={4}>
                    <h5>Available Tickets</h5>
                    <Paper style={{border : '1px solid #cccccc5c'}}>                       
                        {
                            ticketNames.map((item, index)=> {
                                const win_number = this.state.win_number_list?.filter(x=> x.ticket.name == item.name);
                                return (
                                    <>
                                    <div className="ticket-form">                        
                                    <div className="form-outline" style={{marginTop: index == 0 ? 10 :  0}}>     
                                        <CustomizedInputs height={35} purchase={true} value={item.name} disabled={true} label="Ticket Name"/> 
                                    </div>
                                    <div className="form-outline" style={{display:'flex', marginLeft : 15, marginTop: index == 0 ? 10 :  0}}> 
                                        <span style={{fontSize : 15, marginRight : 5, color: 'red'}}>*</span>                                           
                                        <CustomizedInputs height={35} disabled={win_number.length > 0 ? true : false} label={win_number.length > 0 ? win_number[0].winning_number: 'Winning Number'} onChange={(e)=>this.handleWinNum(e, item)} purchase={true}  />                                                                                
                                    </div>                                          
                                    </div>                       
                                    </>
                                )
                            })
                        }           
                        <div className="form-outline">
                            <button style={{ marginTop:0}} disabled={this.state.btnDisable} className="btn  add-user-button" onClick={this.addWinNumber}>Submit</button>
                        </div>                 
                    </Paper>
                </Grid>         
            </Grid>      
            < ToastContainer
                position="top-right"
                autoClose={3000} />
        </div>           
        )
    }
}

export default WinnginNumber
