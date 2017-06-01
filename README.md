* :warning: This client is still a work-in-progress.

# BadgeUp Ionic Client 
Official Ionic client for working with [BadgeUp](https://www.badgeup.io/). This client supports Ionic v2/3.

## Quickstart

```sh
npm install @badgeup/badgeup-ionic-client --save
```

## Initialization
Generate an API key for your application from [BadgeUp dashboard](https://dashboard.badgeup.io/), and configure `@badgeup\badgeup-ionic-client` by adding the BadgeUp Ionic module to the imports in `app.module.ts`.

```js
import {BadgeUpModule} from '@badgeup/badgeup-ionic-client';

@NgModule({
  ...

  imports: [
    ...
    BadgeUpModule.forRoot({apiKey: 'YOUR API KEY HERE'}),
    ...
  ],
  
  ...
})

```

Once the module has been registered, inject the service in the root component and configure the subject provider.
Here is an example of the root component that demonstrates how to configure the subject provider, emit events, and subscribe to new achievements:

```js
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {BadgeUpClient, BadgeUpEvent, BadgeUpEarnedAchievement, BadgeUpNotificationType} from '@badgeup/badgeup-ionic-client';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnDestroy {
  rootPage:any = HomePage;
  badgeUpClient: BadgeUpClient;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, badgeUpClient: BadgeUpClient) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    badgeUpClient.setSubjectProvider((eventKey: string) => {
      return "chris@test.com";
    });

    badgeUpClient.subscribe(this.badgeUpNotificationCallback);
    badgeUpClient.emit({
      key: "amazing"
    });
  }

  ngOnDestroy() {
    this.badgeUpClient.unsubscribe(this.badgeUpNotificationCallback);
  }

  badgeUpNotificationCallback(notificationType: BadgeUpNotificationType, data: any) {
    if(notificationType === BadgeUpNotificationType.NewAchievementEarned) {
      let achievementEarnedData = <BadgeUpEarnedAchievement>data;
      alert("You have received new achievement woop! " + achievementEarnedData.achievementId);
    }
  }
}
```

:warning: Don't forget to unsubscribe in `ngOnDestroy()` as not doing that will cause a memory leak.

## Directives

##### badgeup-click-event
If you want to send events to BadgeUp when a user clicks a button, add a `badgeup-click-event` directive that has an event key as value.
For example, if you want to track users who press a button by firing an event to BadgeUp using the event key "game:refresh", you would use the following code:

```html
<button badgeUpClickEvent="game:refresh">Refresh the game</button>
```

You can also easily pass data using the badgeUpClickEventData attribute:

```html
<button badgeUpClickEvent="game:refresh" 
        badgeUpClickEventData="{foo: true}">Refresh the game</button>
```

You can also provide your own event modifier. The following code would decrement the value by one when you click 'Refresh the game'.
```html
<button badgeUpClickEvent="game:refresh" 
        badgeUpClickEventModifier="@dec" 
        badgeUpClickEventModifierValue="1">Refresh the game</button>
```

If you'd like to pass dynamic data to any of the attributes, you'd have to use property binding syntax. Just add square brackets:
```html
<button badgeUpClickEvent="game:refresh" 
        [badgeUpClickEventData]="{userRank: getUserRank()}">
        Refresh the game
</button>
```
