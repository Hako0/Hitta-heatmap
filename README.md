# Hitta-heatmap

Provided a list of first names, last names or a combination, gathers info from hitta.se and makes a heatmap generated with Google Maps Api to show where the people with the given names are clustered. 

To run : 

`npm install`

`node index.js <parameters>`

Parameters are as follows :
```
  --file, -f     The directory of the file with names seperated by a new line   [required] 
  --key, -k      The google api key                                             [required]
  --timeout, -t  The timeout in ms between each request to hitta.se             [default: 1000]
  --port, -p     The port to run the server on                                  [default: 3000]
  ```
