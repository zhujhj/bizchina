import CreateBoardModal from "./CreateBoardModal";
import Navbar from "./Navbar"
import { useState } from "react";
import Board from './Board'

import { Dialog, Stack, Typography, Box, IconButton, TextField, Button, Grid } from '@mui/material'

const  BoardComponent = () => {
    return (
    <Grid item xs={3}>
        <Stack p={2} bgcolor="grey" borderLeft="5px solid" borderColor="red">
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
                
                <Box width="50%">
                <Typography 
                    color='white' 
                    fontWeight={400} 
                    variant="h6"
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis">
                    Board name
                </Typography>
                </Box>

                <IconButton size="small" color="white">
                    X
                </IconButton>
            </Stack>
            <Typography variant="h6">Created at date</Typography>
        </Stack>
    </Grid>
)}

export default BoardComponent;