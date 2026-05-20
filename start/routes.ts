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
    router.get('create-share-link', [controllers.Session, 'createShareLink'])
  })
  .use(middleware.auth())

router.get('travels-shared/:shareLinkId', [controllers.Travels, 'indexShared'])
