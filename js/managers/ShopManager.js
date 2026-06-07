class ShopManager {
    constructor() {
        this.items = SHOP_ITEMS;
        this.inventory = saveManager.getInventory();
    }

    loadInventory() {
        this.inventory = saveManager.getInventory();
    }

    saveInventory() {
        saveManager.saveInventory(this.inventory);
    }

    getCharacters() {
        return this.items.CHARACTERS.map(char => ({
            ...char,
            owned: this.hasCharacter(char.id),
            selected: this.isSelectedCharacter(char.id)
        }));
    }

    getSkins(characterId = null) {
        let skins = this.items.SKINS;
        if (characterId) {
            skins = skins.filter(s => s.character === characterId);
        }
        return skins.map(skin => ({
            ...skin,
            owned: this.hasSkin(skin.id),
            selected: this.isSelectedSkin(skin.id)
        }));
    }

    getBoosters() {
        return this.items.BOOSTERS.map(booster => ({
            ...booster,
            count: this.getBoosterCount(booster.id)
        }));
    }

    hasCharacter(characterId) {
        return this.inventory.characters.includes(characterId);
    }

    hasSkin(skinId) {
        return this.inventory.skins.includes(skinId);
    }

    getBoosterCount(boosterId) {
        return this.inventory.boosters[boosterId] || 0;
    }

    isSelectedCharacter(characterId) {
        const player = saveManager.getPlayerData();
        return player.selectedCharacter === characterId;
    }

    isSelectedSkin(skinId) {
        const player = saveManager.getPlayerData();
        return player.selectedSkin === skinId;
    }

    purchaseCharacter(characterId) {
        const character = this.items.CHARACTERS.find(c => c.id === characterId);
        if (!character) return { success: false, message: 'Character not found' };
        if (this.hasCharacter(characterId)) return { success: false, message: 'Already owned' };

        if (character.currency === 'coins') {
            if (!saveManager.spendCoins(character.price)) {
                return { success: false, message: 'Not enough coins' };
            }
        } else if (character.currency === 'gems') {
            if (!saveManager.spendGems(character.price)) {
                return { success: false, message: 'Not enough gems' };
            }
        }

        this.inventory.characters.push(characterId);
        this.saveInventory();

        eventManager.emit(CONSTANTS.EVENTS.SHOP_PURCHASE, {
            type: 'character',
            item: character
        });

        notificationManager.success(
            'Purchase Successful!',
            `You unlocked ${character.name}!`
        );

        return { success: true, message: `Unlocked ${character.name}` };
    }

    purchaseSkin(skinId) {
        const skin = this.items.SKINS.find(s => s.id === skinId);
        if (!skin) return { success: false, message: 'Skin not found' };
        if (this.hasSkin(skinId)) return { success: false, message: 'Already owned' };
        if (!this.hasCharacter(skin.character)) {
            return { success: false, message: `Unlock ${skin.character} first` };
        }

        if (skin.currency === 'coins') {
            if (!saveManager.spendCoins(skin.price)) {
                return { success: false, message: 'Not enough coins' };
            }
        } else if (skin.currency === 'gems') {
            if (!saveManager.spendGems(skin.price)) {
                return { success: false, message: 'Not enough gems' };
            }
        }

        this.inventory.skins.push(skinId);
        this.saveInventory();

        eventManager.emit(CONSTANTS.EVENTS.SHOP_PURCHASE, {
            type: 'skin',
            item: skin
        });

        notificationManager.success(
            'Purchase Successful!',
            `You unlocked ${skin.name}!`
        );

        return { success: true, message: `Unlocked ${skin.name}` };
    }

    purchaseBooster(boosterId) {
        const booster = this.items.BOOSTERS.find(b => b.id === boosterId);
        if (!booster) return { success: false, message: 'Booster not found' };

        if (booster.currency === 'coins') {
            if (!saveManager.spendCoins(booster.price)) {
                return { success: false, message: 'Not enough coins' };
            }
        } else if (booster.currency === 'gems') {
            if (!saveManager.spendGems(booster.price)) {
                return { success: false, message: 'Not enough gems' };
            }
        }

        this.inventory.boosters[boosterId] = (this.inventory.boosters[boosterId] || 0) + 1;
        this.saveInventory();

        eventManager.emit(CONSTANTS.EVENTS.SHOP_PURCHASE, {
            type: 'booster',
            item: booster
        });

        notificationManager.success(
            'Purchase Successful!',
            `You bought ${booster.name}!`
        );

        return { success: true, message: `Bought ${booster.name}` };
    }

    useBooster(boosterId) {
        if (this.getBoosterCount(boosterId) <= 0) {
            return false;
        }

        this.inventory.boosters[boosterId]--;
        this.saveInventory();
        return true;
    }

    selectCharacter(characterId) {
        if (!this.hasCharacter(characterId)) return false;
        saveManager.setPlayerStat('selectedCharacter', characterId);
        return true;
    }

    selectSkin(skinId) {
        if (skinId && !this.hasSkin(skinId)) return false;
        saveManager.setPlayerStat('selectedSkin', skinId);
        return true;
    }

    getCharacterPrice(characterId) {
        const character = this.items.CHARACTERS.find(c => c.id === characterId);
        return character ? { price: character.price, currency: character.currency } : null;
    }

    getSkinPrice(skinId) {
        const skin = this.items.SKINS.find(s => s.id === skinId);
        return skin ? { price: skin.price, currency: skin.currency } : null;
    }

    getBoosterPrice(boosterId) {
        const booster = this.items.BOOSTERS.find(b => b.id === boosterId);
        return booster ? { price: booster.price, currency: booster.currency } : null;
    }

    canAfford(price, currency) {
        const player = saveManager.getPlayerData();
        if (currency === 'coins') return player.coins >= price;
        if (currency === 'gems') return player.gems >= price;
        return false;
    }

    getItemDetails(itemId) {
        let item = this.items.CHARACTERS.find(c => c.id === itemId);
        if (item) return { ...item, type: 'character', owned: this.hasCharacter(itemId) };

        item = this.items.SKINS.find(s => s.id === itemId);
        if (item) return { ...item, type: 'skin', owned: this.hasSkin(itemId) };

        item = this.items.BOOSTERS.find(b => b.id === itemId);
        if (item) return { ...item, type: 'booster', count: this.getBoosterCount(itemId) };

        return null;
    }

    refreshInventory() {
        this.loadInventory();
    }
}

const shopManager = new ShopManager();
