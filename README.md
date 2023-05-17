# Description
Add a config file for breakpoints `app.config.ts`.
Add a composable `useDevice` to detect the following informations: 
- breakpoints
- screen orientation
- pointer type
- safari
- gpu power indicator

# Example
```
<div v-if='device.mobile'/>
const device = useDevice()

if(device.mobile.value)// do something
```

You can see it in action in the `playground` too.
