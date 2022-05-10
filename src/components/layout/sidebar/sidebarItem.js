import React from 'react';

import {ListItem,
        ListItemIcon,
        ListItemText,
        makeStyles,
        ListItemAvatar,
        Avatar, Typography
} from '@material-ui/core';

import { AppContext } from '../../../appProvider';

const useStyles = makeStyles(theme => ({
    selectedBorder: {
        borderRightStyle: 'solid',
        borderWidth: '4px',
        backgroundColor: '#0678f414',
        borderColor: '#0678f4',
        color: '#000000',
    },
    selectedFont: {
        fontWeight: 600,
    },
    selectedColor: {
        color: '#000000',
    }, selectedColorContracted: {
        color: '#0678f4',
    },
    avatar: {
        backgroundColor: "#0678f4",
        width: 35,
        height: 35,
    },
    avatarContainer: {
        marginLeft: -4
    }
  }));
  

const SidebarItem = (props) => {

    const [state, setState] = React.useContext(AppContext);
    const classes = useStyles();

    const label = props.selected ? <strong> {props.name} </strong>: props.name; 
    return ( 
        <ListItem button 
            style={props.image ? {width: "25%"} : null}
            onClick={props.onClic} 
            selected={props.selected} 
            key={props.name} 
            className={props.selected ? classes.selectedBorder : null}> 
            {!props.iniciales 
            ?   <ListItemIcon  
                    className={
                        props.selected 
                        ? state.showSidebar
                            ? classes.selectedColor 
                            : classes.selectedColorContracted
                        :null}>
                    {props.icon}
                </ListItemIcon>
            :   <ListItemAvatar className={classes.avatarContainer}>
                    <Avatar className={classes.avatar}>{props.iniciales}</Avatar>
                </ListItemAvatar>
            }
            {state.showSidebar 
                ?   props.image 
                    ? props.image
                    : props.main 
                        ?   <Typography variant="h6" color="initial">PAW</Typography>
                        :   <ListItemText  
                                primary={label} 
                                secondary={props.desc}
                                className={props.selected ? classes.selectedFont : null}
                            />
                : null
            }
        </ListItem>
     );
}
 
export default SidebarItem;


