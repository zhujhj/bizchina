import { Stack, Typography, IconButton } from '@mui/material'
// import CloseIcon from "@mui/icons-material/Close";

const ModalHeader = () => {
    return (
        <Dialog open fullWidth maxWidth='xs'>
            <Stack p={2}>
                <Stack direction='row'>
                    <Typography variant='h5'>Create Board</Typography>
                    <IconButton size='small'>
                        {/* <CloseIcon/> */}
                        X
                    </IconButton>
                </Stack>
            </Stack>
        </Dialog>
    )
}

export default ModalHeader