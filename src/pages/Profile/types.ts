import * as yup from 'yup';
import {
  userDataFormSchema,
  CreateUserProps,
  specialitiesType,
} from '../Signup/types';

export type EditUserFormData = {
  avatar?: string | File;
  name: string;
  email: string;
  cpf: string;
  ddi?: string;
  phone_number: string;
  birthdate: Date;
  speciality: string[];
  speciality_input?: string;
  postal_code: string;
  state: string;
  city: string;
  street: string;
  number: string;
};

export type EditUserProps = Omit<CreateUserProps, 'firebase_id'> & {
  avatar: string | null;
};

export const editUserFormSchema = yup
  .object()
  .shape({})
  .concat(userDataFormSchema);

export function formatDefaultEditUserData(user: UserProps) {
  let specialities = user.specialty.split(',');
  const otherSpecialities = specialities.filter(
    item => !specialitiesType.includes(item),
  );
  specialities = specialities.filter(item => !otherSpecialities.includes(item));

  if (otherSpecialities.length > 0) specialities.push('Outro');

  return {
    avatar: user.avatar,
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    ddi: user.phone_number.slice(0, 4),
    phone_number: user.phone_number.slice(4, user.phone_number.length),
    birthdate: new Date(user.birthdate),
    speciality: specialities,
    speciality_input: otherSpecialities.toString(),
    postal_code: user.postal_code,
    state: user.state,
    city: user.city,
    street: user.street,
    number: user.number,
  };
}
