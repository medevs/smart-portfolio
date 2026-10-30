/**
 * Legal identity for /impressum and /datenschutz only.
 * Do not import this module from the farm, blog, shop, or metadata.
 * The name below must not appear anywhere else on the site.
 */
export const legal = {
  name: "Ahmed Oublihi",
  address: {
    street: "Pommernstraße 17",
    postalCode: "27749",
    city: "Delmenhorst",
    country: "Deutschland",
  },
  email: "oublihi.a@gmail.com",
  responsible: {
    name: "Ahmed Oublihi",
    sameAddress: true,
  },
} as const;

export function formatLegalAddress(address: {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}) {
  return `${address.street}, ${address.postalCode} ${address.city}, ${address.country}`;
}
