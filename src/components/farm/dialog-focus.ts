import { useMemo } from "react";

// Radix cannot find a Trigger when entrances live in the panorama or the 3D scene.
export function createDialogFocusReturn(getOpener: () => HTMLElement | null) {
  let opener: HTMLElement | null = null;
  return {
    onOpenAutoFocus() {
      opener = getOpener();
    },
    onCloseAutoFocus(event: Event) {
      if (opener?.isConnected) {
        event.preventDefault();
        opener.focus({ preventScroll: true });
      }
      opener = null;
    },
  };
}

export function useDialogFocusReturn() {
  return useMemo(() => createDialogFocusReturn(() => {
    const active = document.activeElement;
    return active instanceof HTMLElement && active !== document.body ? active : null;
  }), []);
}
