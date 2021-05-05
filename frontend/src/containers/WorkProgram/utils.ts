import {EvaluationToolType, IntermediateCertificationType, SectionType} from "./types";
import {EvaluationToolFields, fields, workProgramSectionFields} from "./enum";
import {rootState} from "../../store/reducers";
import {
    getWorkProgramEvaluationToolsList,
    getWorkProgramField,
    getWorkProgramIntermediateCertificationList
} from "./getters";
import {MASTER_QUALIFICATION} from "./constants";

export const getEvaluationToolsMaxSum = (evaluationTools: Array<EvaluationToolType>) => {
    let sum = 0;

    evaluationTools.forEach((item) => {
        sum += item[EvaluationToolFields.MAX];
    });

    return sum;
}
export const getIntermediateCertificationMaxSum = (evaluationTools: Array<IntermediateCertificationType>) => {
    let sum = 0;

    evaluationTools.forEach((item) => {
        sum += item[EvaluationToolFields.MAX];
    });

    return sum;
}


export const getHoursArray = (items: string): Array<string> => {
    if (!items || !items?.split) return [];
    const splitterArray = items.split(',');
    const hoursArray = []

    for (let index = 0; index < 10; index++){
        hoursArray[index] = splitterArray[index] ? parseFloat(splitterArray[index]).toFixed(2) : "0";
    }

    return hoursArray;
}

export const getAllHours = (lectureHours: Array<string>, practiceHours: Array<string>, labHours: Array<string>, srsHours: Array<string>) => {
    const lectureHoursTotal = lectureHours.reduce((count: number, item: string): number => count + parseFloat(item), 0);
    const practiceHoursTotal = practiceHours.reduce((count: number, item: string): number => count + parseFloat(item), 0);
    const labHoursTotal = labHours.reduce((count: number, item: string): number => count + parseFloat(item), 0);
    const srsHoursTotal = srsHours.reduce((count: number, item: string): number => count + parseFloat(item), 0);

    return (lectureHoursTotal + practiceHoursTotal + labHoursTotal) * 1.1 + srsHoursTotal;
}

const getTotalHours = (sections: Array<SectionType>) => {
    let count = 0;

    sections.forEach((section: SectionType) => {
        count += Boolean(section[workProgramSectionFields.TOTAL_HOURS]) ? parseFloat(String(section[workProgramSectionFields.TOTAL_HOURS])) : 0;
    })

    return count;
};

export const getValidateProgramErrors = (state: rootState): Array<string> => {
    const sections = getWorkProgramField(state, fields.WORK_PROGRAM_SECTIONS);
    const qualification = getWorkProgramField(state, fields.WORK_PROGRAM_QUALIFICATION);
    const errors = [];
    const evaluationToolsList = getWorkProgramEvaluationToolsList(state);

    const lectureHours = getHoursArray(getWorkProgramField(state, 'lecture_hours'));
    const practiceHours = getHoursArray(getWorkProgramField(state, 'practice_hours'));
    const labHours = getHoursArray(getWorkProgramField(state, 'lab_hours'));
    const srsHours = getHoursArray(getWorkProgramField(state, 'srs_hours'));
    const totalHours = getWorkProgramField(state, fields.WORK_PROGRAM_ALL_HOURS) || getAllHours(lectureHours, practiceHours, labHours, srsHours);
    const currentTotalHours = getTotalHours(sections).toFixed(2);

    if (!sections.length){
        errors.push('Кол-во разделов должно быть больше 0');
    }

    if (totalHours === 0){
        errors.push('Общее кол-во часов не может быть 0');
    } else if (parseFloat(totalHours) !== parseFloat(currentTotalHours)){
        errors.push('Ошибка в часах, проверьте часы в дисциплине');
    }

    if (totalHours % 36 !== 0){
        errors.push('Общее кол-во должно делиться на 36 без остатка');
    }

    sections.forEach((section: SectionType) => {
        if (!section.topics?.length){
            errors.push(`Кол-во тем в разделе "${section.name}" должно быть больше 0`)
        }
    });

    if (!evaluationToolsList.length){
        errors.push('В РПД отсутствуют оценочные средства');
    }

    if (getEvaluationToolsMaxSum(evaluationToolsList) + getIntermediateCertificationMaxSum(getWorkProgramIntermediateCertificationList(state)) !== 100 && qualification !== MASTER_QUALIFICATION){
        errors.push('Количество баллов в РПД не равно 100');
    }

    return errors;
}