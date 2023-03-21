
const Discord = require('discord.js');
const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = Discord;
const fs = require('node:fs');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('patchnotes')
        .setDescription('Displays what has been changed in the Bot.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(
            PermissionsBitField.Flags.ViewAuditLog
            | PermissionsBitField.Flags.KickMembers
            | PermissionsBitField.Flags.ManageChannels
            | PermissionsBitField.Flags.ManageEmojisAndStickers
            | PermissionsBitField.Flags.ManageGuild
            | PermissionsBitField.Flags.ManageMessages
            | PermissionsBitField.Flags.ManageRoles
            | PermissionsBitField.Flags.ModerateMembers
            | PermissionsBitField.Flags.ManageThreads
            | PermissionsBitField.Flags.ManageWebhooks
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Help text.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List of Patchnotes')
                .addStringOption(option =>
                    option
                        .setName('year')
                        .setDescription('sort after year')
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('get')
                .setDescription('get patchenotes')
                .addStringOption(option =>
                    option
                        .setName('notes')
                        .setDescription('Notes Name (20w15a)')
                        .setRequired(true)
                )
        )
        ,
    prefix: 'true',    // Prefix = 'true', No Prefix = 'false', Slash Command = '/'.
    nsfw: 'false',       // NSFW variable = 'true', No NSFW variable = 'false'.
    admin: 'true',      // Admin Command = 'true', No Admin Command = 'false'.
    async execute(interaction) {
        if (interaction != null || interaction.channel.id != null || interaction.guild.id != null) {
            // SQLite
            const { Get } = require('../../../../ClanCore/Modules/functions/sqlite/prepare');
            // Data Null
            let dataLang;
            let dataCommandAdmin;
            let dataChannelAdmin;
            let dataChannelAdminGuild;
            // Data Get
            let getGuildID = `${interaction.guild.id}`;
            let getBotConfigID = `${interaction.guild.id}-${interaction.guild.shardId}`;
            let getChannelRoleIDChannel = `${getGuildID}-${interaction.guild.shardId}-${interaction.channel.id}`;
            dataLang = Get.botConfig(getBotConfigID);
            dataCommandAdmin = Get.onOffForCommandAdmin(getBotConfigID);
            dataChannelAdmin = Get.channelForAdmin(getChannelRoleIDChannel);
            dataChannelAdminGuild = Get.channelForAdminByGuild(getGuildID);
            // Data Check
            if (dataLang == null) { dataLang = { Lang: `./Database/lang/en_US.json` }; };
            if (dataCommandAdmin == null) { dataCommandAdmin = { Patchnotes: 'true' }; };
            if (dataChannelAdminGuild == null) { dataChannelAdmin = { ChannelID: `${interaction.channel.id}` }; };
            // Context
            if (dataCommandAdmin.Patchnotes === 'true') {
                let lang = require('../../../.' + dataLang.Lang);
                if (dataChannelAdmin != null && interaction.channel.id === dataChannelAdmin.ChannelID) {
                    if (interaction.options.getSubcommand() === 'help') {
                        const configEmbed = new EmbedBuilder()
                        configEmbed.setTitle('Patchnotes - Help')
                        .addFields([
                            { name: 'commands', value: '`patchnotes` - Commands relating to patchnotes.\n` ⤷help` - Displays this help text.\n` ⤷list` - A List of patchnotes.\n` ⤷get` - Get a spesific patchnote.', inline: false },
                        ]);
                        await interaction.reply({ embeds: [configEmbed] });
                    };
                    if (interaction.options.getSubcommand() === 'list') {
                        const patchListEmbed = new EmbedBuilder()
                            .setColor('DarkGreen')
                        const stringGetYear = interaction.options.getString('year');
                        const patchnote_files = fs.readdirSync('./Database/patchnotes/').filter(file => file.endsWith('.json'));
                        if  (!stringGetYear) {
                            let patchDate = [];
                            let patchName = [];
                            let patchVersion = [];
                            for (const file of patchnote_files) {
                                let rawData = fs.readFileSync(`./Database/patchnotes/${file}`);
                                let patchRead = JSON.parse(rawData);
                                patchDate.push(patchRead[0].date);
                                patchName.push(patchRead[0].number);
                                patchVersion.push(patchRead[0].version);
                            };
                            let stringPatchDate = patchDate.toString();
                            let stringPatchName = patchName.toString();
                            let stringPatchVersion = patchVersion.toString();
                            let StringPatchDateOne = stringPatchDate.replace(/[,]/gi, '\n');
                            let StringPatchNameOne = stringPatchName.replace(/[,]/gi, '\n');
                            let StringPatchVersionOne = stringPatchVersion.replace(/[,]/gi, '\n');
                            let spno = StringPatchNameOne.replace(/[\n]/gi, '');
                            let spdo = StringPatchDateOne.replace(/[\n]/gi, '');
                            let spvo = StringPatchVersionOne.replace(/[\n]/gi, '');
                            if (!spno) {StringPatchNameOne = 'No Data Found.';};
                            if (!spdo) {StringPatchDateOne = 'No Data Found.';};
                            if (!spvo) {StringPatchVersionOne = 'No Data Found.';};
                            patchListEmbed
                                .setTitle('Patchnotes List')
                                .addFields(
                                { name: 'Name', value: `\`\`\`\n${StringPatchNameOne}\n\`\`\``, inline: true },
                                { name: 'Date', value: `\`\`\`\n${StringPatchDateOne}\n\`\`\``, inline: true },
                                { name: 'Version', value: `\`\`\`\n${StringPatchVersionOne}\n\`\`\``, inline: true },
                            );
                            await interaction.reply({embeds: [patchListEmbed]});
                        } else if (stringGetYear) {
                            let stringYear = stringGetYear.replace('20', '');
                            const patchnote_files_year = fs.readdirSync('./Database/patchnotes/').filter(file => file.endsWith('.json') && file.startsWith(stringYear));
                            let patchDateYear = [];
                            let patchNameYear = [];
                            let patchVersionYear = [];
                            for (const file of patchnote_files_year) {
                                let rawDataYear = fs.readFileSync(`./Database/patchnotes/${file}`);
                                let patchRead = JSON.parse(rawDataYear);
                                patchDateYear.push(patchRead[0].date);
                                patchNameYear.push(patchRead[0].number);
                                patchVersionYear.push(patchRead[0].version);
                            };
                            let stringPatchDateYear = patchDateYear.toString();
                            let stringPatchNameYear = patchNameYear.toString();
                            let stringPatchVersionYear = patchVersionYear.toString();
                            let StringPatchDateYearOne = stringPatchDateYear.replace(/[,]/gi, '\n');
                            let StringPatchNameYearOne = stringPatchNameYear.replace(/[,]/gi, '\n');
                            let StringPatchVersionYearOne = stringPatchVersionYear.replace(/[,]/gi, '\n');
                            let spno = StringPatchNameYearOne.replace(/[\n]/gi, '');
                            let spdo = StringPatchDateYearOne.replace(/[\n]/gi, '');
                            let spvo = StringPatchVersionYearOne.replace(/[\n]/gi, '');
                            if (!spno) {StringPatchNameYearOne = 'No Data Found.';};
                            if (!spdo) {StringPatchDateYearOne = 'No Data Found.';};
                            if (!spvo) {StringPatchVersionYearOne = 'No Data Found.';};
                            patchListEmbed
                            .setTitle(`Patchnotes List - 20${stringYear}`)
                            .addFields(
                                { name: 'Name', value: `\`\`\`\n${StringPatchNameYearOne}\n\`\`\``, inline: true },
                                { name: 'Date', value: `\`\`\`\n${StringPatchDateYearOne}\n\`\`\``, inline: true },
                                { name: 'Version', value: `\`\`\`\n${StringPatchVersionYearOne}\n\`\`\``, inline: true },
                            );
                            await interaction.reply({embeds: [patchListEmbed]});
                        };
                    };
                    if (interaction.options.getSubcommand() === 'get') {
                        const stringGetNotes = interaction.options.getString('notes');
                        let stringNotes = `${stringGetNotes}.json`;
                        const patchnote_files_get = fs.readdirSync('./Database/patchnotes/').filter(file => file.endsWith('.json'));
                        const stringPatchNote = patchnote_files_get.filter(file => file === stringNotes);
                        let stringCleanPatch = stringPatchNote.toString();
                        if (stringCleanPatch === '') {
                            return;
                        } else {
                            let rawdata = fs.readFileSync(`./Database/patchnotes/${stringCleanPatch}`);
                            let patchRead = JSON.parse(rawdata);
                            let stringEmbedRead = patchRead.map(function(obj){
                                return obj.embed;
                            });
                            let stringDateRead = patchRead.map(function(obj){
                                return obj.date;
                            });
                            let stringNumberRead = patchRead.map(function(obj){
                                return obj.number;
                            });
                            let stringPatchEmbed = stringEmbedRead.toString();
                            let stringPatchDate = stringDateRead.toString();
                            let stringPatchNumber = stringNumberRead.toString();
                            let patchEmbed = stringPatchEmbed.replaceAll(' ,', '');
                            let patchDate = stringPatchDate.replaceAll(/[,]/gi, '');
                            let patchNumber = stringPatchNumber.replaceAll(/[,]/gi, '');
                            let embed = `**Patchnotes - ${patchDate}**\n\n${patchNumber}\n\`\`\`\n${patchEmbed}\n\`\`\``;
                            await interaction.reply({content: embed});
                        };
                    };
                // Error Messages
                } else {
                    await interaction.reply({ content: 'Admin Commands can only be used in Admin Channels.', ephemeral: true });
                };
            } else {
                await interaction.reply({ content: 'This command is not available right now.', ephemeral: true });
            };
        } else {
            console.log(`[${DateTime.utc().toFormat(timeFormat)}][ClanBot] Interaction of Command \'patchnotes\' returned \'null / undefined\'.`);
        };
    },
};