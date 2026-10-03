import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@capacitor/share', () => ({
  Share: {
    share: vi.fn(async () => undefined),
  },
}))

import { Share } from '@capacitor/share'
import { shareLocalFile } from '@/lib/shareLocalFile'

describe('shareLocalFile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shares local files as attachments', async () => {
    await shareLocalFile({
      title: 'app.log',
      uri: 'file:///data/user/0/app/files/logs/app.log',
      dialogTitle: 'Save log file',
    })

    expect(Share.share).toHaveBeenCalledWith({
      title: 'app.log',
      files: ['file:///data/user/0/app/files/logs/app.log'],
      dialogTitle: 'Save log file',
    })
  })
})
