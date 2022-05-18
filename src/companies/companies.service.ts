import { Injectable, NotFoundException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class CompaniesService {
  companyName = '';

  getNumber = async (page: puppeteer.Page) => {
    await page.waitForTimeout(5000);
    if (await page.$('.Hhmu2e > .Ftghae > .SPZz6b > .qrShPb > span')) {
      if (
        (await page.$eval(
          '.Hhmu2e > .Ftghae > .SPZz6b > .qrShPb > span',
          (el) =>
            el.innerHTML
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toUpperCase(),
        )) !== this.companyName.split(' ').shift().toUpperCase()
      ) {
        throw new NotFoundException('Company name different from address');
      }
    }
    if (!(await page.$('span > .LrzXr > a > span > span'))) {
      throw new NotFoundException('Number not found');
    }
    const result = await page.evaluate(() => {
      return document.querySelector('span > .LrzXr > a > span > span')
        .innerHTML;
    });
    return result;
  };

  getReverseSiren = async (page: puppeteer.Page) => {
    await page.waitForTimeout(5000);
    if (!(await page.$('#identite_deno'))) {
      throw new NotFoundException('Name company not found');
    }
    const result = await page.evaluate(() => {
      return document.querySelector('#identite_deno').innerHTML;
    });
    return result;
  };

  fetchCompanyWithName = async (page: puppeteer.Page, nameCompany: string) => {
    await page.goto('https://www.google.com/');
    await page.click('#L2AGLb');
    await page.waitForSelector('.A8SBwf > .RNNXgb > .SDkEP > .a4bIc > .gLFyf');
    await page.click('.A8SBwf > .RNNXgb > .SDkEP > .a4bIc > .gLFyf');
    await page.type(
      '.A8SBwf > .RNNXgb > .SDkEP > .a4bIc > .gLFyf',
      nameCompany,
    );
    await page.keyboard.press('Enter');
  };

  fetchCompanyWithSiren = async (
    page: puppeteer.Page,
    sirenCompany: string,
  ) => {
    await page.goto('https://www.societe.com/');
    await page.click('#input_search');
    await page.type('#input_search', sirenCompany);
    await page.click('#buttsearch');
  };

  async getData(company: string) {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    const regex = /^[0-9]*$/g;
    if (company.match(regex) && company.length !== 9) {
      throw new NotFoundException('Siren invalid');
    }

    if (company.match(regex) && company.length === 9) {
      await this.fetchCompanyWithSiren(page, company);
      this.companyName = await this.getReverseSiren(page);
    } else {
      this.companyName = company;
    }

    this.fetchCompanyWithName(page, this.companyName);
    const getNumber = await this.getNumber(page);

    await browser.close();

    return { company_phone_number: getNumber };
  }
}
