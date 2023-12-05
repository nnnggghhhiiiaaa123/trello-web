import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect'

function BoardContent() {
    return (
        <Box sx={{
            backgroundColor: 'primary.main',
            width: '100%',
            height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
            display: 'flex',
            alignItems: 'center'

        }}>
            <ModeSelect />
        </Box>
    )
}

export default BoardContent