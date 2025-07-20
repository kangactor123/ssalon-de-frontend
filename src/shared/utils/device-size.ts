type Device = "mobile" | "tablet" | "desktop";
type Size = number;

const DeviceViewport: Record<Device, Size> = {
  mobile: 640, // Tailwind's sm breakpoint
  tablet: 768, // Tailwind's md breakpoint
  desktop: 1024, // Tailwind's lg breakpoint
};

export const getDevice = (size: Size): Device => {
  if (size > DeviceViewport.desktop) {
    return "desktop";
  } else if (size > DeviceViewport.tablet) {
    return "tablet";
  } else {
    return "mobile";
  }
};
