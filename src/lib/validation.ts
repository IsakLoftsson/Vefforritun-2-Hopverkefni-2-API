import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import slugify from 'slugify';
import xss from 'xss';
import { getDatabase } from './db.js';

export function createTaskValidationMiddleware() {
  return [
    // format should be like 2024-02-11T19:01
    body('date')
      .trim()
      .custom((value) => {
        const date = new Date(value);
        return !Number.isNaN(date.getTime());
      })
      .withMessage('Dagsetning verður að vera gild'),
    body('task_type').custom(async (value) => {
      const task_type = (await getDatabase()?.getTaskTypes()) ?? [];
    
      if (!task_type.find((t) => t.id.toString() === value.toString())) {
        throw new Error('TaskType verkefnis verður að vera gilt');
      }
      return true;
    }),
    body('task_tag').custom(async (value) => {
      const task_tag = (await getDatabase()?.getTaskTags()) ?? [];

      if (!task_tag.find((t) => t.id.toString() === value.toString())) {
        throw new Error('TaskTag verkefnis verður að vera gilt');
      }
      return true;
    }),
    // þarf að laga verður allt öðruvísi gilli
    body('user_id').custom(async (value) => {
      const user_id = (await getDatabase()?.getUsers()) ?? [];

      if (!user_id.find((t) => t.id.toString() === value.toString())) {
        throw new Error('userError');
      }
      return true;
    }),
    /* Þurfum ekki?
    body('home_score')
      .isInt({ min: 0, max: 99 })
      .withMessage(
        'Stig heimaliðs verður að vera heiltala, 0 eða stærri, hámark 99',
      ),
    body('away_score')
      .isInt({ min: 0, max: 99 })
      .withMessage(
        'Stig útiliðs verður að vera heiltala, 0 eða stærri, hámark 99',
      ),
    */
  ];
}

// Viljum keyra sér og með validation, ver gegn „self XSS“
export function xssSanitizationMiddleware() {
  return [
    body('name').customSanitizer((v) => xss(v)),
    body('description').customSanitizer((v) => xss(v)),
    body('date').customSanitizer((v) => xss(v)),
    body('task_type.name').customSanitizer((v) => xss(v)),
    body('task_tag.name').customSanitizer((v) => xss(v)),
    body('user_id').customSanitizer((v) => xss(v)),
  ];
}

export function sanitizationMiddleware() {
  return [
    body('name').trim().escape(),
    body('description').trim().escape(),
    body('date').trim().escape(),
    body('task_type.name').trim().escape(),
    body('task_tag.name').trim().escape(),
    body('user_id').trim().escape(),
  ];
}

export const stringValidator = ({
  field = '',
  valueRequired = true,
  minLenght = 0,
  maxLength = 0,
  optional = false,
} = {}) => {
  const val = body(field)
    .trim()
    .isString()
    .isLength({
      min: minLenght ? minLenght : undefined,
      max: maxLength ? maxLength : undefined,
    })
    .withMessage(
      [
        field,
        valueRequired ? 'required' : '',
        minLenght ? `min ${minLenght}` : '',
        maxLength ? `max ${maxLength} characters` : '',
      ]
        .filter((i) => Boolean(i))
        .join(' '),
    );

  if (optional) {
    return val.optional();
  }
  return val;
};

export const xssSanitizer = (param: string) =>
  body(param).customSanitizer((v) => xss(v));

export const xssSanitizerMany = (params: string[]) =>
  params.map((param) => xssSanitizer(param));

export const genericSanitizer = (param: string) => body(param).trim().escape();

export const genericSanitizerMany = (params: string[]) =>
  params.map((param) => genericSanitizer(param));

/**
 * Checks to see if there are validation errors or returns next middlware if not.
 * @param req HTTP request
 * @param res HTTP response
 * @param next Next middleware
 * @returns Next middleware or validation errors.
 */
export function validationCheck(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const errors = validation.array();
    const notFoundError = errors.find((error) => error.msg === 'not found');
    const serverError = errors.find((error) => error.msg === 'server error');

    let status = 400;

    if (serverError) {
      status = 500;
    } else if (notFoundError) {
      status = 404;
    }

    return res.status(status).json({ errors });
  }

  return next();
}

export const taskTypeDoesNotExistValidator = body('name').custom(async (name) => {
  if (await await getDatabase()?.getTaskType(slugify(name))) {
    return Promise.reject(new Error('TaskType already exists'));
  }
  return Promise.resolve();
});

export function atLeastOneBodyValueValidator(fields: Array<string>) {
  return body().custom(async (value, { req }) => {
    const { body: reqBody } = req;

    let valid = false;

    for (let i = 0; i < fields.length; i += 1) {
      const field = fields[i];

      if (field in reqBody && reqBody[field] != null) {
        valid = true;
        break;
      }
    }

    if (!valid) {
      return Promise.reject(
        new Error(`require at least one value of: ${fields.join(', ')}`),
      );
    }
    return Promise.resolve();
  });
}
