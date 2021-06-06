import {WithStyles} from "@material-ui/core";
import {fields, NotificationsFields} from './enum';
import styles from "./Notifications.styles";
import {WorkProgramGeneralType} from "../../WorkProgram/types";
import {EducationalPlanType} from "../../EducationalPlan/types";
import {TrainingModuleType} from "../../EducationalPlan/TrainingModules/types";

export interface NotificationsActions {
    getNotifications: any;
    setNotifications: any;
}

export interface notificationsState {
    [fields.NOTIFICATIONS]: any;
}

export interface FoldersProps extends WithStyles<typeof styles>{
    folders: Array<FolderType>;
    actions: NotificationsActions;
}


export type FolderType = {
    [NotificationsFields.ID]: number;
    [NotificationsFields.DESCRIPTION]: string;
    [NotificationsFields.NAME]: string;
    [NotificationsFields.WORK_PROGRAM_IN_FOLDER]: Array<{
        [NotificationsFields.WORK_PROGRAM]: WorkProgramGeneralType;
        [NotificationsFields.WORK_PROGRAM_RATING]: string;
        [NotificationsFields.COMMENT]: string;
        [NotificationsFields.ID]: number;
    }>;
    [NotificationsFields.ACADEMIC_PLAN_IN_FOLDER]: Array<{
        [NotificationsFields.ACADEMIC_PLAN]: EducationalPlanType;
        [NotificationsFields.ACADEMIC_PLAN_RATING]: string;
        [NotificationsFields.COMMENT]: string;
        [NotificationsFields.ID]: number;
    }>;
    [NotificationsFields.INDIVIDUAL_ACADEMIC_PLAN_IN_FOLDER]: Array<{
        [NotificationsFields.INDIVIDUAL_ACADEMIC_PLAN]: {
            [NotificationsFields.IMPLEMENTATION_OF_ACADEMIC_PLAN]: {
                [NotificationsFields.ACADEMIC_PLAN]: EducationalPlanType
            }
        };
        [NotificationsFields.INDIVIDUAL_ACADEMIC_PLAN_RATING]: string;
        [NotificationsFields.COMMENT]: string;
        [NotificationsFields.ID]: number;
    }>;
    [NotificationsFields.BLOCK_MODULE_IN_FOLDER]: Array<{
        [NotificationsFields.BLOCK_MODULE]: TrainingModuleType;
        [NotificationsFields.BLOCK_MODULE_RATING]: string;
        [NotificationsFields.COMMENT]: string;
        [NotificationsFields.ID]: number;
    }>;
}