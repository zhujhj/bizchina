import CreateBoardModal from "./CreateBoardModal";
import Navbar from "./Navbar"
import { useState } from "react";
import BoardComponent from './Board'

import { Dialog, Stack, Typography, Box, IconButton, TextField, Button, Grid } from '@mui/material'

const Dashboard = () => {
    const [showModal, setShowModal] = useState(false)
    return (
    <>
        <Navbar openModal={() => setShowModal(true)}/>
        {showModal && <CreateBoardModal closeModal={() => setShowModal(false)} />}
        {/* <Stack mt={15} textAlign='center' spacing={1}>
            <Typography variant="h5">No boards created</Typography>
            <Typography variant="h6">Create your first board today!</Typography>
        </Stack> */}
        <Stack mt={5} px={3}>
            <Grid container spacing={4}>
                <BoardComponent/>
                <BoardComponent/>
            </Grid>
        </Stack>
    </>
)}

export default Dashboard;