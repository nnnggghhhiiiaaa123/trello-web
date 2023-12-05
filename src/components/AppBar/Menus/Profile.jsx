import * as React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Check from '@mui/icons-material/Check'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

function Profiles() {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    return (
        <Box>
            <Button
                sx={{ color: 'white' }}
                id="basic-button-recent"
                aria-controls={open ? 'basic-menu-recent' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                endIcon={<ExpandMoreIcon />}
            >
                Profiles
            </Button>
            <Tooltip title="Account settings">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'basic-menu-profiles' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar
                        sx={{ width: 30, height: 30 }}
                        alt="Trung Quan idol"
                        src='https://www.google.com/url?sa=i&url=https%3A%2F%2Ftuoitre.vn%2Fha-anh-tuan.html&psig=AOvVaw3mUACnXEwUuejcFhv6-vSV&ust=1701677488620000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPi25-Lo8oIDFQAAAAAdAAAAABAE'
                    />          </IconButton>
            </Tooltip>
            <Menu
                id="basic-menu-profiles"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button-profiles'
                }}
            >
                <MenuItem onClick={handleClose}>
                    <Avatar sx={{ width: 28, height: 28, mr: 2 }} />
                    Profile
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Avatar sx={{ width: 28, height: 28, mr: 2 }} />
                    My account
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    Add another account
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    )
}

export default Profiles