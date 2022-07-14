/** Georepo URL */


function updateToken(url) {
  if (preferences.georepo_api_key) {
    const urls = url.split('?')
    let parameters = urls[1] ? urls[1].split('&') : []
    parameters.unshift('token=' + preferences.georepo_api_key)
    urls[1] = parameters.join('&')
    url = urls.join('?')
  }
  return url
}

export const GeorepoUrls = {
  WithDomain: function (url) {
    return updateToken(preferences.georepo_api.domain + url)
  },
  ReferenceList: updateToken(
    preferences.georepo_api.reference_layer_list
  ),
  ReferenceDetail: function (identifier) {
    return updateToken(
      preferences.georepo_api.reference_layer_detail.replace('<identifier>', identifier)
    )
  }
}