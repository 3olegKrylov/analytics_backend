import get from 'lodash/get';

import {rootState} from '../../store/reducers';

import {GENERAL_PATH} from "./reducer";

import {fields} from './enum';

import {educationalProgramState, EducationalProgramCharacteristicType, EducationalProgramType} from './types';
import {SelectorListType} from "../../components/SearchSelector/types";
import {AcademicPlan, CompetenceMatrix} from './Characteristic/CompetenceMatrix/types';

const getStateData = (state: rootState): educationalProgramState => get(state, GENERAL_PATH);
export const getEducationalProgramCharacteristic = (state: rootState): EducationalProgramCharacteristicType|{} => get(getStateData(state), fields.EDUCATION_PROGRAM_CHARACTERISTIC, {});
export const getEducationalProgramId = (state: rootState): number => get(getEducationalProgramCharacteristic(state), 'educational_program.id', 0);
export const getEducationalProgramCharacteristicId = (state: rootState): number => get(getEducationalProgramCharacteristic(state), 'id', 0);

export const getSupraProfessionalCompetencies = (state: rootState): EducationalProgramCharacteristicType|{} =>
    get(getEducationalProgramCharacteristic(state), fields.EDUCATION_PROGRAM_CHARACTERISTIC, {})
;
export const getEducationalProgramList = (state: rootState): Array<EducationalProgramType> => get(getStateData(state), fields.EDUCATION_PROGRAM_LIST, []);

export const getKindsOfActivitiesForSelector = (state: rootState): SelectorListType =>
// @ts-ignore
  getKindsOfActivity(state).map((item: any ) => ({
        value: item.id,
        label: item.name,
    }))
export const getObjectsOfActivitiesForSelector = (state: rootState): SelectorListType =>
// @ts-ignore
  getObjectsOfActivity(state).map((item: any ) => ({
        value: item.id,
        label: item.name,
    }))
export const getTasksTypesForSelector = (state: rootState): SelectorListType =>
// @ts-ignore
  getTasksTypes(state).map((item: any ) => ({
        value: item.id,
        label: item.name,
    }))
export const getCompetenceMatrix = (state: rootState): CompetenceMatrix => get(getStateData(state), fields.COMPETENCE_MATRIX, {});
export const getMatrixAcademicPlans = (state: rootState): AcademicPlan[] => get(getCompetenceMatrix(state), 'wp_matrix', []);

export const getEducationalProgramCharacteristicDialog = (state: rootState) => get(getStateData(state), fields.EDUCATION_PROGRAM_DIALOG, {});
export const getKindsOfActivity = (state: rootState) => get(getStateData(state), fields.KINDS_OF_ACTIVITIES, []);
export const getObjectsOfActivity = (state: rootState) => get(getStateData(state), fields.OBJECTS_OF_ACTIVITIES, []);
export const getTasksTypes = (state: rootState) => get(getStateData(state), fields.TASKS_TYPES, []);

export const isOpenDialog = (state: rootState) => get(getEducationalProgramCharacteristicDialog(state), fields.IS_OPEN_DIALOG, false);
export const getDialogData = (state: rootState) => get(getEducationalProgramCharacteristicDialog(state), fields.DIALOG_DATA, false);

export const getAllCount = (state: rootState) => get(getStateData(state), fields.ALL_COUNT, 1);
export const getCurrentPage = (state: rootState) => get(getStateData(state), fields.CURRENT_PAGE, 1);
export const getSearchQuery = (state: rootState) => get(getStateData(state), fields.SEARCH_QUERY, '');

export const getSorting = (state: rootState) => get(getStateData(state), fields.SORTING, {});
export const getSortingField = (state: rootState) => get(getSorting(state), fields.SORTING_FIELD, '');
export const getSortingMode = (state: rootState) => get(getSorting(state), fields.SORTING_MODE, '');
