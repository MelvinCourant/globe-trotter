/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home', {}).as('home')
router.on('/shared/:shareLinkId').renderInertia('home', {}).as('shared-travels')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])

    router.get('forgotten-password', [controllers.PasswordReset, 'create']).as('forgotten_password.create')
    router.post('forgotten-password', [controllers.PasswordReset, 'store']).as('forgotten_password.store')
    router.get('reset-password/:token', [controllers.PasswordReset, 'edit']).as('password_reset.edit')
    router.post('reset-password/:token', [controllers.PasswordReset, 'update']).as('password_reset.update')
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
    router.post('steps', [controllers.Steps, 'create'])
    router.patch('steps/:id', [controllers.Steps, 'update'])
    router.delete('steps/:id', [controllers.Steps, 'destroy'])
    router.post('travels', [controllers.Travels, 'create'])
    router.get('travels', [controllers.Travels, 'index'])
    router.get('travels/steps-travels', [controllers.Travels, 'indexStepsTravels'])
    router.get('travels/search', [controllers.Travels, 'search'])
    router.get('users/create-share-link', [controllers.Session, 'createShareLink'])
    router.post('users/update-theme', [controllers.Session, 'updateTheme'])
    router.post('users/update-profile-picture', [controllers.Session, 'updateProfilePicture'])
  })
  .use(middleware.auth())

router.get('travels-shared/:shareLinkId', [controllers.Travels, 'indexShared'])
