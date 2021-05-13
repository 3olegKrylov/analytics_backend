import {createStyles, makeStyles, Theme} from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        padding: '20px 50px 20px 50px',
        background: '#fff',
        minHeight: 'calc(100% - 44px)',
        display: 'flex',
        flexDirection: 'column'
    },
    title: {
        fontSize: '24px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    notificationItem: {
        marginBottom: '10px',
        padding: '15px',
        border: '1px solid #ccc',
        borderRight: '5px solid orange'
    },
    notificationItemLink: {
        color: theme.palette.text.primary,
        textDecoration: 'none'
    },
    roundItem: {
        display: 'flex',
        marginBottom: '10px',
        alignItems: 'center'
    },
    round: {
        display: 'block',
        width: '10px',
        height: '10px',
        background: 'orange',
        borderRadius: '50%',
        marginRight: '5px'
    },
    roundText: {

    }
}));