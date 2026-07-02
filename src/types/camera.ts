export type CameraPermissionState = 'idle' | 'prompt' | 'granted' | 'denied'

export type CameraState = {
  permissionState: CameraPermissionState
  stream: MediaStream | null
  error: string | null
  isLoading: boolean
  isSupported: boolean
}
