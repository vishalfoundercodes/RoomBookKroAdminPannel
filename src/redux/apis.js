const baseUrl = "https://root.roombookkro.com";
const configuration=`${baseUrl}/api/`

export const apis = {
  addEnums: `${configuration}addenumoption`,
  getEnum: `${configuration}getenum?null`,
  toggleenum: `${configuration}toggleenum`,
  placeorder: `${configuration}placeorder`,
  bank_update: `${configuration}bank/update`,
  bank_delete: `${configuration}bank/delete`,
  bankdetails_user: `${configuration}bankdetails/user`,
};