const fixUrl = url => url.replace(/\/\//g, '/').replace(':/', '://')

const headersToJson = (headers) => {
  // add link and meta's to head
  const head = {}

  const regex = /(\S+)="([^"]+)"?/g
  headers.split('\n').forEach((header) => {
    const type = /<([^\s>]+)/.exec(header)[1]
    if (type === 'link' || type === 'meta') {
      if (!(Array.isArray(head[type]))) {
        head[type] = []
      }
      const attrs = {}
      let match
      while ((match = regex.exec(header))) {
        if (match[1] === 'rel' && match[2] === 'manifest') {
          return
        }
        if (match[1] === 'href' || match[1] === 'content') {
          match[2] = fixUrl(match[2])
        }
        attrs[match[1]] = match[2]
      }
      head[type].push(attrs)
    }
  })
  return head
}

const loading = (prefix = '') => {
  var h = ['|', '/', '-', '\\'];
  var i = 0;

  const intervalID = setInterval(() => {
    i = (i > 3) ? 0 : i;
    console.clear();
    console.log(prefix + h[i]);
    i++;
  }, 300)

  return intervalID;
}

export { headersToJson, loading }
