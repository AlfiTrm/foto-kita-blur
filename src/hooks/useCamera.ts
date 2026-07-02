import type { CameraPermissionState, CameraState } from '../types/camera'

const INITIAL_PERMISSION_STATE: CameraPermissionState = 'idle'

export function useCamera(): CameraState {
  return {
    permissionState: INITIAL_PERMISSION_STATE,
    stream: null,
    error: null,
    isLoading: false,
    isSupported: typeof navigator !== 'undefined' && 'mediaDevices' in navigator,
  }
}
