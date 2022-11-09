function appendRevision(body, url, packageName, revision) {
  const packagePlusRevision = `${packageName}_revision=${revision}`;
  let revisionLink = `${url}?${packagePlusRevision}`
  let stylizedLink = `[${packagePlusRevision}](${revisionLink})`

  let updatedBody = `${body}\n\n --- \n\n${stylizedLink}`

  if (body.includes(url)) {
    if (body.includes(`${packageName}_revision=`)) {
      // existing package w/other revision
      const regexPattern = `(${packageName}_revision=)+[A-Fa-f0-9]{7}`
      let regex = new RegExp(regexPattern, 'g');

      updatedBody = body.replace(regex, packagePlusRevision);
    } else {
      // existing other try links
      updatedBody = body.concat(`\n${stylizedLink}`)
    }
  }

  return updatedBody;
}

module.exports = appendRevision;