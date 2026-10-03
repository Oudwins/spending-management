import { Share } from '@capacitor/share'

export type ShareLocalFileInput = {
  title: string
  uri: string
  dialogTitle: string
}

export async function shareLocalFile({ title, uri, dialogTitle }: ShareLocalFileInput) {
  await Share.share({
    title,
    files: [uri],
    dialogTitle,
  })
}
