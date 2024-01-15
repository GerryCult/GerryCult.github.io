### Sideload an excel add-in
Copy the manifest.xml file to this folder:`/Users/gerry/Library/Containers/com.microsoft.Excel/Data/Documents/wef`
### Debug on office for mac

`defaults write com.microsoft.Word OfficeWebAddinDeveloperExtras -bool true`

`defaults write com.microsoft.Excel OfficeWebAddinDeveloperExtras -bool true`

`defaults write com.microsoft.Powerpoint OfficeWebAddinDeveloperExtras -bool true`

`defaults write com.microsoft.Outlook OfficeWebAddinDeveloperExtras -bool true`
