<a:application xmlns:a="http://ajax.org/2005/aml">
    <a:window
      id        = "winSettings"
      title     = "Settings"
      icon      = ""
      center    = "true"
      buttons   = "close"
      kbclose   = "true"
      width     = "550"
      height    = "300">
        <a:vbox anchors="0 0 0 0">
            <a:hbox padding="8" edge="10" model="{require('ext/settings/settings').model}" actiontracker="atSettings" flex="1">
                <a:vbox width="150" padding="5">
                    <a:textbox initial-message="Filter" />
                    <a:tree flex="1"
                      each      = "[node()[local-name() and not(local-name() = 'auto')]]"
                      eachvalue = "[@page]"
                      caption   = "[@name]"
                      icon      = "{[@icon] || 'folder.png'}" 
                      startcollapsed = "false"
                      onafterselect  = "
                        var page = pgSettings.getPage(this.value);
                        if (!page) return;
                        page.setAttribute('model', this.selected);
                        pgSettings.set(this.value);
                      "/>
                </a:vbox>
                <a:splitter />
                <a:pages id="pgSettings" flex="1">
                    <a:page id="pgSettingsGeneral" render="runtime">
                        <a:frame caption="General" anchors="0 0 0 0">
                            <a:checkbox value="[@openfiles]">Open files at startup</a:checkbox>
                        </a:frame>
                    </a:page>
                    <a:page id="pgSettingsEditor" render="runtime">
                        <a:frame caption="Editor" anchors="0 0 0 0"></a:frame>
                    </a:page>
                </a:pages>
            </a:hbox>
            <a:hbox pack="end" edge="0 10 5 10" padding="5">
                <a:button width="80" default="2" class="ui-btn-green">OK</a:button>
                <a:button width="80" onclick="winSettings.hide();">Cancel</a:button>
                <a:button width="80" disabled="{!atSettings.undolength}">Apply</a:button>
            </a:hbox>
        </a:vbox>
    </a:window>
</a:application>