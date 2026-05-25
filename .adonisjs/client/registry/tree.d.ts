/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  drive: {
    fs: {
      serve: typeof routes['drive.fs.serve']
    }
  }
  home: typeof routes['home']
  sharedTravels: typeof routes['shared-travels']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
    createShareLink: typeof routes['session.create_share_link']
    updateTheme: typeof routes['session.update_theme']
  }
  forgottenPassword: {
    create: typeof routes['forgotten_password.create']
    store: typeof routes['forgotten_password.store']
  }
  passwordReset: {
    edit: typeof routes['password_reset.edit']
    update: typeof routes['password_reset.update']
  }
  steps: {
    create: typeof routes['steps.create']
    update: typeof routes['steps.update']
    destroy: typeof routes['steps.destroy']
  }
  travels: {
    create: typeof routes['travels.create']
    index: typeof routes['travels.index']
    indexShared: typeof routes['travels.index_shared']
  }
}
