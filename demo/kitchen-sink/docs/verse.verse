# Coin rush: players press buttons to collect coins until time runs out.
using { /Fortnite.com/Devices }
using { /Verse.org/Simulation }
using { /UnrealEngine.com/Temporary/Diagnostics }

<# Block comments can span lines
   <# and they nest #> #>

<#>
    An indented comment covers every line
    that is indented below the marker.

coin_kind<public> := enum:
    Bronze
    Silver
    Gold

coin<public> := struct:
    Kind<public> : coin_kind = coin_kind.Bronze

TargetPoints<public> : int = 0x64

# A char is one UTF-8 code unit, a char32 one Unicode code point.
Separator<public> : char = '|'
Tab<public> : char = '\t'
LineFeed<public> : char = 0o0A
CoinIcon<public> : char32 = 0u1FA99

PointsFor<public>(Kind:coin_kind)<computes>:int =
    case (Kind):
        coin_kind.Gold => 10
        coin_kind.Silver => 5
        coin_kind.Bronze => 1

wallet<public> := class<concrete>:
    var Points<public> : int = 0
    var Collected<private> : []coin = array{}

    Collect<public>(Item:coin)<transacts>:void =
        set Points += PointsFor(Item.Kind)
        set Collected += array{Item}

    Spend<public>(Amount:int)<transacts><decides>:void =
        Amount > 0 and Points >= Amount
        set Points -= Amount

    Describe<public>()<reads>:string =
        Golds := for (Item : Collected, Item.Kind = coin_kind.Gold) { Item }
        "{Points} points ({Golds.Length} gold)"

# Counts silver and gold coins twice.
bonus_wallet<public> := class<concrete>(wallet):
    Collect<override>(Item:coin)<transacts>:void =
        (super:)Collect(Item)
        if (Item.Kind <> coin_kind.Bronze):
            (super:)Collect(Item)

coin_rush_device := class(creative_device):
    @editable
    GoldButton : button_device = button_device{}

    @editable
    BronzeButton : button_device = button_device{}

    @editable
    RoundSeconds : float = 60.0

    @editable
    AnnounceWinner : logic = true

    var Wallets : [player]wallet = map{}

    OnBegin<override>()<suspends>:void =
        GoldButton.InteractedWithEvent.Subscribe(OnGoldPressed)
        BronzeButton.InteractedWithEvent.Subscribe(OnBronzePressed)
        CountDown(3)
        RunRound()

    OnGoldPressed(Agent:agent):void =
        Award(Agent, coin{Kind := coin_kind.Gold})

    OnBronzePressed(Agent:agent):void =
        Award(Agent, coin{})

    Award(Agent:agent, Item:coin):void =
        if (Player := player[Agent]):
            if (Wallet := Wallets[Player]):
                Wallet.Collect(Item)
            else:
                NewWallet := bonus_wallet{}
                NewWallet.Collect(Item)
                if (set Wallets[Player] = NewWallet) {}

    CountDown(Seconds:int)<suspends>:void =
        for (Elapsed := 0..Seconds - 1):
            Print("{Seconds - Elapsed}...")
            Sleep(1.0)
        Print("Press \"Gold\" or \"Bronze\" to collect coins!")

    RunRound()<suspends>:void =
        defer:
            Print("Round over!\n")
        race:
            Sleep(RoundSeconds)
            WaitForWinner()

    WaitForWinner()<suspends>:void =
        loop:
            Sleep(0.5)
            if (Winner := Leader[]):
                if (AnnounceWinner?):
                    Print("Winner: {Winner.Describe()}")
                break

    Leader()<reads><decides>:wallet =
        first(Wallet : Wallets, Wallet.Points >= TargetPoints). Wallet
