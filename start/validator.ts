/*
|--------------------------------------------------------------------------
| Validator file
|--------------------------------------------------------------------------
|
| The validator file is used for configuring global transforms for VineJS.
| The transform below converts all VineJS date outputs from JavaScript
| Date objects to Luxon DateTime instances, so that validated dates are
| ready to use with Lucid models and other parts of the app that expect
| Luxon DateTime.
|
*/

import vine, { SimpleMessagesProvider, VineDate } from '@vinejs/vine'
import { DateTime } from 'luxon'

declare module '@vinejs/vine/types' {
  interface VineGlobalTransforms {
    date: DateTime
  }
}

VineDate.transform((value) => DateTime.fromJSDate(value))

vine.messagesProvider = new SimpleMessagesProvider({
  'email.required': 'L\'adresse email doit être défini',
  'email.email': 'L\'adresse email n\'est pas valide',
  'firstname.maxLength': 'Le prénom ne peut pas dépasser {{ max }} caracteres',
  'lastname.maxLength': 'Le nom ne peut pas dépasser {{ max }} caracteres',
  'password.required': 'Le mot de passe doit être défini',
  'password.minLength': 'Le mot de passe doit contenir au moins {{ min }} caracteres',
  'password.maxLength': 'Le mot de passe ne peut pas dépasser {{ max }} caracteres',
  'passwordConfirmation.confirmed': 'Le mot de passe et la confirmation ne correspondent pas.',
  'file': 'Ce champ doit être un fichier.',
  'file.size': 'Le fichier ne peut pas dépasser {{ size }}.',
  'file.extnames': 'Le fichier doit être au format : {{ extnames }}.',
  'title.required' : 'Le titre doit être défini',
  'title.maxLength' : 'Le titre ne doit pas dépasser {{ max } caractères',
  'description.maxLength' : 'La description ne doit pas dépasser {{ max } caractères',
  'longitude.required' : 'La localisation doit être défini',
  'latitude.required' : 'La localisation doit être défini',
  'place.required' : 'La localisation doit être défini',
  'start_date.required': 'La date de début doit être défini',
  'end_date.required': 'La date de fin doit être défini',
  'link.url': 'L\'URL n\'est pas valide.',
  'travel_id.required': 'Le voyage doit être défini',
  'travel_title.required': 'Le voyage doit être défini'
})
