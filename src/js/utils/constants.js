export const HOUR_LABEL_MIN_WIDTH = 50;
export const HOUR_WIDTH_PX = 60;
export const HOURS_PER_DAY = 24;
export const MINUTES_PER_HOUR = 60;
export const DELAY = 1000; // time listener interval

export const SCALE_MIN = 0.1;
export const SCALE_MAX = 1;
export const SCALE_STEP = 0.01;

export const MONTHS_IN_YEAR = 12;
export const DAYS_IN_YEAR = 365;
export const DAYS_IN_LEAP_YEAR = DAYS_IN_YEAR + 1;

export const ID_PERIOD_FORMAT = 'x';

export const TASK_USER_FIELDS = [{
    label: 'Description',
    name: 'description',
    type: 'text',
    placeholder: 'No description'
  }, {
    label: 'Color',
    name: 'color',
    type: 'select',
    storage: 'colors',
    limit: 1
  }, {
    label: 'Project',
    name: 'project',
    type: 'select',
    storage: 'projects',
    limit: 1
  }, {
    label: 'Billable',
    name: 'billable',
    type: 'checkbox'
  }];

export const DEFAULT_FIELDS_VALUES = {
  projects: ['Betmaster', 'hr.csssr.ru', 'Dental', 'Innos', 'Yota'],
  labels: ['coding', 'reading', 'sleeping'],
  colors: ['', '#0f93cc', '#fa6a23', '#dd2486', '#810bac', '#6b6901']
};
