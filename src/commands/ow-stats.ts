import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, EmbedField } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

import { queryPlayerNames, queryPlayerStats, queryPlayerSummary } from "../overfast.js";
import { capitalizeWords, formatNumber } from "../strings.js";
import { convertTimeToHours, round } from "../math.js";
import consts from "../consts.js";

@Discord()
@SlashGroup({
  description: "Display all kinds of career stats for any player in the game",
  name: "ow-stats",
})
@SlashGroup("ow-stats")
export class PlayerStatsCommand {
  @Slash({
    name: "summary",
    description: "Display a summary of career ranks for the specified player",
  })
  async command(
    @SlashOption({
      required: true,
      name: "player-name",
      description: "The name of the player to grab the stats of (start typing to search)",
      type: ApplicationCommandOptionType.String,
      autocomplete: (interaction) => {
        const value = interaction.options.getFocused(true).value;

        queryPlayerNames(value).then((profiles) => {
          interaction
            .respond(
              profiles.results.map((profile) => ({
                value: profile.player_id.replace("-", "#"),
                name: `${profile.name} - ${capitalizeWords(profile.privacy)}`,
              }))
            )
            .catch(() => {
              console.log("oops");
            });
        });
      },
    })
    name: string,
    interaction: CommandInteraction
  ) {
    await interaction.reply({
      content: `Fetching all necessary data for ${name}, one moment!`,
    });

    try {
      const [summary, stats] = await Promise.all([await queryPlayerSummary(name), await queryPlayerStats(name)]);

      const fields: EmbedField[] = [];

      if (summary.privacy === "public") {
        Object.entries(summary.competitive).forEach(([platform, roles]) => {
          if (!roles) return;

          Object.entries(roles).forEach(([key, value]) => {
            if (!value) {
              fields.push({
                name: `${consts.platformEmojis[platform]} ${capitalizeWords(key)}`,
                value: "*No Data*",
                inline: true,
              });
              return;
            }

            fields.push({
              name: `${consts.platformEmojis[platform]} ${capitalizeWords(key)}`,
              value: `
              Rank: **${capitalizeWords(value.division)} ${value.tier}**
              Time: **${formatNumber(convertTimeToHours(stats?.roles[key].time_played ?? 0))} hrs**
            `,
              inline: true,
            });
          });
        });
      }

      let description = [`• **Level ${summary.endorsement.level}** Endorsement Rating`];

      if (summary.privacy === "private") {
        description.push("*Competitive stats unavailable for private profiles and may take up to an hour to update*");
      } else if (stats) {
        description.push(
          ...[
            `• **${convertTimeToHours(stats.general.time_played)}** Hours Played`,
            `• **${formatNumber(stats.general.games_played)}** Games Played`,
            `• **${stats.general.winrate}%** Winrate`,
            `• **${formatNumber(stats.general.kda)}** KDA`,
            `• **${formatNumber(stats.general.total.eliminations)}** Kills, **${formatNumber(
              stats.general.total.deaths
            )}** Deaths, **${formatNumber(stats.general.total.healing)}** Healing`,
          ]
        );

        const timePlayedSorted = Object.entries(stats.heroes)
          .sort(([, a], [, b]) => {
            return b.time_played - a.time_played;
          })
          .slice(0, 3);

        fields.push({
          name: "Most Played",
          value: timePlayedSorted
            .map(
              (hero, i) =>
                `#${i + 1}: **${capitalizeWords(hero[0])}** *(${formatNumber(
                  convertTimeToHours(hero[1].time_played)
                )}hrs)*`
            )
            .join("\n"),
          inline: true,
        });

        const damageSorted = Object.entries(stats.heroes)
          .sort(([, a], [, b]) => {
            return b.total.eliminations - a.total.eliminations;
          })
          .slice(0, 3);

        fields.push({
          name: "Most Kills",
          value: damageSorted
            .map(
              (hero, i) => `#${i + 1}: **${capitalizeWords(hero[0])}** *(${formatNumber(hero[1].total.eliminations)})*`
            )
            .join("\n"),
          inline: true,
        });

        const healingSorted = Object.entries(stats.heroes)
          .sort(([, a], [, b]) => {
            return b.total.healing - a.total.healing;
          })
          .slice(0, 3);

        fields.push({
          name: "Most Healing",
          value: healingSorted
            .map((hero, i) => `#${i + 1}: **${capitalizeWords(hero[0])}** *(${formatNumber(hero[1].total.healing)})*`)
            .join("\n"),
          inline: true,
        });
      }

      const embed = new EmbedBuilder()
        .setColor("#cd8032")
        .setTitle(`Competitive Summary for ${summary.username}`)
        .setThumbnail(summary.avatar)
        .setDescription(description.join("\n"))
        .addFields(fields)
        .setFooter({ text: name });

      interaction.editReply({ content: "", embeds: [embed] });
    } catch (e) {
      console.log(e);
      interaction.editReply({
        content: `An error occurred while trying to fetch data for ${name}`,
      });
    }
  }
}
