import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Select from '@material-ui/core/Select';
import Axios from 'axios';
// popup
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import '../style-sheet/pagination.css'

const URL = `${process.env.REACT_APP_API_BASE_URL}`;
//popup
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const columns = [
  { id: 'name', label: 'Name', minWidth: 100,  align: 'center' },
  {
    id: 'mobile',
    label: 'Mobile',
    minWidth: 100,
    align: 'center'
  },
  {
    id: 'email',
    label: 'Email',
    minWidth: 100,
    align: 'center'
  },
  {
    id: 'is_active',
    label: 'Active',
    minWidth: 100,
    align: 'center'
  },
];
const useStyles = makeStyles({
  root: {
    width: '80%',
    margin:`3% 0 0 10%`,
  },
  container: {
    maxHeight: 440,
  },
});
export default function StickyHeadTable(props) {    
  const classes = useStyles();
  const [rows, setRow] = React.useState([])
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // popup
  const [editData, setEditData] = React.useState({});
  const [readOnly, setReadOnly] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  // popup
  const handleClose = () => {
    setOpen(false);
    setReadOnly(true)
  };
  // component did mount
  useEffect(async () => {
    let { data } = await Axios.get(`${URL}/api/v1/user?name=${props.searchName}&page_no=${page}&limit=${rowsPerPage}`);    
    setRow(data.data.attributes.data);
  }, []);

  useEffect(async () => {
    let { data } = await Axios.get(`${URL}/api/v1/user?name=${props.searchName}&page_no=${page}&limit=${rowsPerPage}`);    
    setRow(data.data.attributes.data);
  }, [props.searchName]);
  // our custom function
  const userPagination = async (event, something) => {
    let { data } = await Axios.get(`${URL}/api/v1/user?name=${props.searchName}&page_no=${something}&limit=${rowsPerPage}`);
    setRow(data.data.attributes.data);
    setRowsPerPage(+rowsPerPage);
    setPage(something);
  }
  // it call whenever rowsperpage changes
  useEffect(() => {
    userPagination(rowsPerPage, 0)
  }, [rowsPerPage]);
  // popup
  const updateUser = async (payload) => {    
    let { data } = await Axios.patch(`${URL}/api/v1/user/${payload._id}`, {
      data: {
        attributes: {
            email: payload.email,
            name:payload.name,
            mobile:payload.mobile,
            is_active: payload.active,

        }
      }
    });
    userPagination(rowsPerPage, 0)
    setOpen(false);
    setReadOnly(true);
  }
  function rowClick(a) {    
    setEditData(a);
    setOpen(true);
  }
  // popup
  const changeReadonly = () => {
    setReadOnly(false)
  }
  // change rows per page
  const handleChangeRowsPerPage = async (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    // const classes = useStyles();
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow selected={true}>
              {columns.map((column) => (
                <TableCell
                  key={column._id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code} onClick={() => rowClick(row)}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? value : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 25, 100]} // we can set whatever we want
        component="div"
        count={29} // !! important ---> need to set total count of records
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={userPagination} // our custom function (NEXT, PREV) button
        onChangeRowsPerPage={handleChangeRowsPerPage} // rows per page function
      />
      {/* popup start */}
      <Dialog 
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        contentStyle={{width: "100%", maxWidth: "none"}}
       
      >
        <DialogTitle s>{"User View"}</DialogTitle>
        <DialogContent>

        <form className={classes.container}  >
            Email : &nbsp; &nbsp; &nbsp; 
            <TextField
              name={'email'}
              value={editData.email}
              inputProps={{
                readOnly: readOnly
              }}
              onInput={e => setEditData(prevState => {
                return { ...prevState, [e.target.name]: e.target.value }
              })}
              
            /> 
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <br />
            Name : &nbsp; &nbsp; &nbsp; 
            <TextField
              name={'name'}
              value={editData.name}
              InputProps={{
                readOnly: readOnly
              }}
              onInput={e => setEditData(prevState => {
                return { ...prevState, [e.target.name]: e.target.value }
              })}
            />
            <br />
            Mobile : &nbsp;&nbsp;&nbsp; 
            <TextField
              name={'mobile'}
              value={editData.mobile}
              InputProps={{
                readOnly: readOnly
              }}
              onInput={e => setEditData(prevState => {
                return { ...prevState, [e.target.name]: e.target.value }
              })}

            />
 
          <br />	
              Active : &nbsp;&nbsp;&nbsp;
              <Select name={'active'} onChange={e => setEditData(prevState => {
              return { ...prevState, [e.target.name]: e.target.value }
            })} inputProps={{
              readOnly: readOnly
            }} >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => updateUser({ ...editData })} disabled={readOnly} color="primary">
            Update
          </Button>
          <Button onClick={changeReadonly} color="primary">
            Edit
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* popup end */}
    </Paper>
  );
} 