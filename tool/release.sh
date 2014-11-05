pause() {
    while true; do
        read -p "$1 " yn
        case $yn in
            [Yy]* ) break;;
            [Nn]* ) exit;;
            * ) echo "Please answer yes or no.";;
        esac
    done
}

read -p "enter version number for the build " VERSION_NUM

cd `dirname $0`/..
SOURCE=`pwd`

node -e "
    var fs = require('fs');
    var version = '$VERSION_NUM';
    function replaceVersion(str) {
        return str.replace(/(['\"]?version['\"]?\s*[:=]\s*['\"])[\\d.\\w\\-](['\"])/, function(_, m1, m2) {
            return m1 + version + m2;
        });
    }
    function update(path, replace) {
        var pkg = fs.readFileSync(path, 'utf8');
        pkg = (replace || replaceVersion)(pkg);
        fs.writeFileSync(path, pkg, 'utf8');
    }
    update('package.json');
    update('build/package.json');
    update('./lib/ace/ext/menu_tools/generate_settings_menu.js');
    update('ChangeLog.txt', function(str) {
        var date='"`date +%Y.%m.%d`"';
        return date + ' Version ' + version + '\n' + str.replace(/^\d+.*/, '').replace(/^\n/, '');
    });
"



node Makefile.dryice.js full
cd build
git add .
git commit --all -m "package `date +%d.%m.%y`"


echo "build task completed."
pause "continue creating the tag for v$VERSION_NUM [y/n]"
if [[ ${VERSION_NUM} != *"-"* ]]; then
    git tag "v"$VERSION_NUM
fi

pause "continue pushing to github? [y/n]"

git push --progress --tags "origin" HEAD:gh-pages HEAD:master

echo "build repository updated"

pause "continue update ace repo? [y/n]"
cd ..


echo "new commit added"
pause "continue creating the tag for v$VERSION_NUM [y/n]"
if [[ ${VERSION_NUM} != *"-"* ]]; then
    git tag "v"$VERSION_NUM
fi

pause "continue pushing to github? [y/n]"

echo git push --progress --tags "origin" HEAD:gh-pages HEAD:master
echo "All done!"
pause "May I go now? [y/n]"

