import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isAfter', async: false })
export class IsAfterConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string | Date, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    
    // If either value is missing, skip validation
    if (!propertyValue || !relatedValue) {
      return true;
    }
    
    try {
      // Handle both string and Date objects
      const propertyDate = propertyValue instanceof Date ? propertyValue : new Date(propertyValue);
      const relatedDate = relatedValue instanceof Date ? relatedValue : new Date(relatedValue);
      
      // Check for valid dates
      if (isNaN(propertyDate.getTime()) || isNaN(relatedDate.getTime())) {
        return false;
      }
      
      return propertyDate > relatedDate;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must be after ${relatedPropertyName}`;
  }
}