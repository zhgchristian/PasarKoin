<script>
import { RouterLink } from 'vue-router';
import { useTradeStore } from '../stores/store';
import { useRegisterStore } from '../stores/store';
import { mapActions, mapState } from 'pinia';

export default {
    name: "TradePage",
    data() {
        return {
            exhangeRate: 15000,
            connection: null,
            marketData: {
                BTCBIDR: 0,
                ETHBIDR: 0,
                BNBBIDR: 0,
                SOLBIDR: 0,
                ADABIDR: 0,
                DOTBIDR: 0,
                MATICBIDR: 0,
                XRPBIDR: 0,
                DOGEBIDR: 0,
                ZILBIDR: 0
            },
            openTradesHeadings: [
                "#",
                "Asset",
                "Quantity",
                "Average Price",
                "Amount",
                "Floating*",
                "Action"
            ]
        };
    },
    computed: {
        ...mapState(useTradeStore, ["openTrades"]),
    },
    methods: {
        ...mapActions(useTradeStore, ["fetchOpenTrade"]),
        ...mapActions(useRegisterStore, ["fetchProfile"]),
        initiateWSS() {
            this.connection = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum,binance-coin,solana,cardano,polkadot,polygon,ripple,dogecoin,ziliqa");
            this.connection.onmessage = (event) => {
                if (JSON.parse(event.data).bitcoin) {
                    this.marketData.BTCBIDR = Number(JSON.parse(event.data).bitcoin) * this.exhangeRate;
                }
                if (JSON.parse(event.data).ethereum) {
                    this.marketData.ETHBIDR = Number(JSON.parse(event.data).ethereum) * this.exhangeRate;
                }
                if (JSON.parse(event.data)["binance-coin"]) {
                    this.marketData.BNBBIDR = Number(JSON.parse(event.data)["binance-coin"]) * this.exhangeRate;
                }
                if (JSON.parse(event.data).solana) {
                    this.marketData.SOLBIDR = Number(JSON.parse(event.data).solana) * this.exhangeRate;
                }
                if (JSON.parse(event.data).cardano) {
                    this.marketData.ADABIDR = Number(JSON.parse(event.data).cardano) * this.exhangeRate;
                }
                if (JSON.parse(event.data).polkadot) {
                    this.marketData.DOTBIDR = Number(JSON.parse(event.data).polkadot) * this.exhangeRate;
                }
                if (JSON.parse(event.data).polygon) {
                    this.marketData.MATICBIDR = Number(JSON.parse(event.data).polygon) * this.exhangeRate;
                }
                if (JSON.parse(event.data).ripple) {
                    this.marketData.XRPBIDR = Number(JSON.parse(event.data).ripple) * this.exhangeRate;
                }
                if (JSON.parse(event.data).dogecoin) {
                    this.marketData.DOGEBIDR = Number(JSON.parse(event.data).dogecoin) * this.exhangeRate;
                }
                if (JSON.parse(event.data).ziliqa) {
                    this.marketData.ZILBIDR = Number(JSON.parse(event.data).ziliqa) * this.exhangeRate;
                }
            };
            this.connection.onopen = function (event) {
            };
        },
        priceDisplay(symbol, amount, qty) {
            console.log('STARTING')
            for (const key in this.marketData) {
                if (symbol === key) {
                    if (this.marketData[key] !== 0) {
                        const result = Math.floor(this.marketData[key] * qty - amount);
                        return result;
                    }
                }
            }
        },

    },
    created() {
        this.fetchOpenTrade();
        this.initiateWSS();
        this.fetchProfile();
    },
    unmounted() {
        this.connection.close();
    },
    components: { RouterLink }
}
</script>

<template>
    <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
        <!-- Navbar -->
        <nav class="navbar navbar-main navbar-expand-lg mx-5 px-0 shadow-none rounded" id="navbarBlur" navbar-scroll="true">
            <div class="container-fluid py-1 px-2">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb bg-transparent mb-1 pb-0 pt-1 px-0 me-sm-6 me-5">
                        <li class="breadcrumb-item text-sm">Dashboard</li>
                        <li class="breadcrumb-item text-sm text-dark active" aria-current="page">Trading</li>
                    </ol>
                    <h6 class="font-weight-bold mb-0">Trading</h6>
                </nav>
                <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
                    <div class="ms-md-auto pe-md-3 d-flex align-items-center">
                        <div class="input-group">
                        </div>
                    </div>

                </div>
            </div>
        </nav>
        <!-- End Navbar -->
        <div class="container-fluid py-4 px-5">
            <div class="row">
                <div class="col-12">
                    <div class="card border shadow-xs mb-4">
                        <div class="card-header border-bottom pb-0">
                            <div class="d-sm-flex align-items-center">
                                <div>
                                    <h6 class="font-weight-semibold text-lg mb-0">Open Trades list</h6>
                                    <p class="text-sm">See information about all open trades</p>
                                </div>
                                <div class="ms-auto d-flex">
                                    <RouterLink to="/buy"
                                        class="btn btn-sm btn-dark btn-icon d-flex align-items-center me-2">
                                        <span class="btn-inner--text">Buy Crypto</span>
                                    </RouterLink>
                                </div>
                            </div>
                        </div>
                        <div class="card-body px-0 py-0">
                            <div class="table-responsive p-0">
                                <table class="table align-items-center mb-0">
                                    <thead class="bg-gray-100">
                                        <tr>
                                            <th class="text-sm text-dark font-weight-semibold text-center"
                                                v-for="heading in openTradesHeadings">{{ heading }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(trade, idx) in openTrades" :key="trade.id">
                                            <td class="text-center">
                                                <span class="text-secondary text-sm font-weight-bold">{{ idx + 1 }}</span>
                                            </td>
                                            <td>
                                                <div class="d-flex px-2 py-1">
                                                    <div class="d-flex align-items-center">
                                                        <img :src="trade.Commodity.imageUrl"
                                                            class="avatar avatar-sm rounded-circle me-2" alt="user1">
                                                    </div>
                                                    <div class="d-flex flex-column justify-content-center ms-1">
                                                        <h6 class="mb-0 text-sm font-weight-semibold">{{
                                                            trade.Commodity.name }}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="align-middle text-center">
                                                <p class="text-sm text-dark font-weight-semibold mb-0">{{ trade.quantity }}
                                                </p>
                                            </td>
                                            <td class="align-middle text-center">
                                                <p class="text-sm text-dark font-weight-semibold mb-0">{{
                                                    trade.averagePrice.toLocaleString("id-ID", {
                                                        style:
                                                            "currency", currency: "IDR"
                                                    }) }}</p>
                                            </td>
                                            <td class="align-middle text-center">
                                                <p class="text-sm text-dark font-weight-semibold mb-0">{{
                                                    trade.amount.toLocaleString("id-ID", {
                                                        style:
                                                            "currency", currency: "IDR"
                                                    }) }}
                                                </p>
                                            </td>
                                            <td class="align-middle text-center">
                                                <p class="text-sm text-primary font-weight-semibold mb-0">
                                                    {{
                                                        priceDisplay(trade.Commodity.symbol, trade.amount,
                                                            trade.quantity)?.toLocaleString("id-ID", {
                                                                style:
                                                                    "currency", currency: "IDR"
                                                            }) }}
                                                </p>
                                            </td>
                                            <td class="align-middle text-center">
                                                <RouterLink :to="`/sell/${trade.Commodity.id}`"
                                                    class="text-secondary font-weight-bold text-xs" data-bs-toggle="tooltip"
                                                    data-bs-title="Edit user">
                                                    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24" fill="currentColor">
                                                        <path fill-rule="evenodd"
                                                            d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                </RouterLink>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!-- <div class="border-top py-3 px-3 d-flex align-items-center">
                                <p class="font-weight-semibold mb-0 text-dark text-sm">Page 1 of 10</p>
                                <div class="ms-auto">
                                    <button class="btn btn-sm btn-white mb-0">Previous</button>
                                    <button class="btn btn-sm btn-white mb-0">Next</button>
                                </div>
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>

            <footer class="footer pt-3  ">
                <div class="container-fluid">
                    <div class="row align-items-center justify-content-lg-between">
                        <div class="col-lg-6 mb-lg-0 mb-4">
                            <div class="copyright text-center text-xs text-muted text-lg-start mb-2">
                                *Floating calculations are approximate. We will not be responsible for any losses due to
                                inaccuracy of this information.
                            </div>
                            <div class="copyright text-center text-xs text-muted text-lg-start">
                                Copyright © 2023
                                PasarKoin. Design by
                                <a href="https://www.creative-tim.com" class="text-secondary" target="_blank">Creative
                                    Tim</a>.
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    </main>
</template>