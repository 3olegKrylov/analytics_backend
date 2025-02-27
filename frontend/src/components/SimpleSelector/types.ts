import {WithStyles} from "@material-ui/core";
import styles from "./SimpleSelector.styles";
import {ReactText} from "react";

export interface QualificationSelectorProps extends WithStyles<typeof styles> {
    value?: ReactText;
    label: string;
    onChange: Function;
    noMargin?: boolean;
    wrapClass: string;
    metaList: Array<{
        label: string;
        value: ReactText;
    }>
}