import { AppBar, Toolbar, Button, Stack } from '@mui/material'
import LogoImg from '../../images/logo.png';
// import { useNavigate } from "react-router-dom";

// const navigate = useNavigate();

function navigateToChat() {
    // Change the URL to the desired page
    window.location.href = '/chat';
}

function navigateToLogin() {
    // Change the URL to the desired page
    window.location.href = '/';
}

const Navbar = ({openModal}) => {
    return (
        <AppBar position='static'>
            <Toolbar sx={{justifyContent: "space-between",}}>
                <img src={LogoImg}/>
                <Stack direction="row" spacing={5}>
                    <Button onClick={openModal} variant="contained">Create Board</Button>
                    <Button variant="contained" onClick={navigateToChat}>Chat</Button>
                    <Button variant="contained" onClick={navigateToLogin}>Logout</Button>
                </Stack>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar