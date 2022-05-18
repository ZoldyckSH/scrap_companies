import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import * as puppeteer from 'puppeteer';

describe('CompaniesService', () => {
  let service: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompaniesService],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getData', () => {
    it('should get number company with siren', async () => {
      jest.spyOn(puppeteer, 'launch').mockImplementation(() => {
        return ({
          newPage: jest.fn().mockImplementation(() => {
            return {
              waitForNavigation: jest.fn().mockImplementation(() => {}),
              goto: jest.fn().mockImplementation(() => {}),
              $: jest
                .fn()
                .mockImplementationOnce(() => {
                  return true;
                })
                .mockImplementationOnce(() => {
                  return false;
                })
                .mockImplementationOnce(() => {
                  return true;
                }),
              waitForTimeout: jest.fn().mockImplementation(() => {}),
              click: jest.fn().mockImplementation(() => {}),
              type: jest.fn().mockImplementation(() => {}),
              evaluate: jest
                .fn()
                .mockImplementationOnce(() => {
                  return 'october';
                })
                .mockImplementationOnce(() => {
                  return '123456789';
                }),
              waitForSelector: jest.fn().mockImplementation(() => {}),
              $eval: jest.fn().mockImplementation(() => {
                return 'october';
              }),
              keyboard: {
                press: jest.fn().mockImplementation(() => {}),
              },
            };
          }),
          close: jest.fn().mockImplementation(() => {}),
        } as unknown) as any;
      });

      const result = await service.getData('303830244');
      expect(result).toMatchObject({ company_phone_number: '123456789' });
    });

    it('should get number company with company name', async () => {
      jest.spyOn(puppeteer, 'launch').mockImplementation(() => {
        return ({
          newPage: jest.fn().mockImplementation(() => {
            return {
              waitForNavigation: jest.fn().mockImplementation(() => {}),
              goto: jest.fn().mockImplementation(() => {}),
              $: jest
                .fn()
                .mockImplementationOnce(() => {
                  return false;
                })
                .mockImplementationOnce(() => {
                  return true;
                }),
              waitForTimeout: jest.fn().mockImplementation(() => {}),
              click: jest.fn().mockImplementation(() => {}),
              type: jest.fn().mockImplementation(() => {}),
              evaluate: jest.fn().mockImplementation(() => {
                return '0607080910';
              }),
              waitForSelector: jest.fn().mockImplementation(() => {}),
              $eval: jest.fn().mockImplementation(() => {
                return 'october';
              }),
              keyboard: {
                press: jest.fn().mockImplementation(() => {}),
              },
            };
          }),
          close: jest.fn().mockImplementation(() => {}),
        } as unknown) as any;
      });

      const result = await service.getData('october');
      expect(result).toMatchObject({ company_phone_number: '0607080910' });
    });

    it('should get number company with company name + address', async () => {
      jest.spyOn(puppeteer, 'launch').mockImplementation(() => {
        return ({
          newPage: jest.fn().mockImplementation(() => {
            return {
              waitForNavigation: jest.fn().mockImplementation(() => {}),
              goto: jest.fn().mockImplementation(() => {}),
              $: jest
                .fn()
                .mockImplementationOnce(() => {
                  return false;
                })
                .mockImplementationOnce(() => {
                  return true;
                }),
              waitForTimeout: jest.fn().mockImplementation(() => {}),
              click: jest.fn().mockImplementation(() => {}),
              type: jest.fn().mockImplementation(() => {}),
              evaluate: jest.fn().mockImplementation(() => {
                return '04 50 34 63 54';
              }),
              waitForSelector: jest.fn().mockImplementation(() => {}),
              $eval: jest.fn().mockImplementation(() => {
                return 'experdeco 70 Rte du Giffre, 74970 Marignier';
              }),
              keyboard: {
                press: jest.fn().mockImplementation(() => {}),
              },
            };
          }),
          close: jest.fn().mockImplementation(() => {}),
        } as unknown) as any;
      });

      const result = await service.getData(
        'experdeco 70 Rte du Giffre, 74970 Marignier',
      );
      expect(result).toMatchObject({ company_phone_number: '04 50 34 63 54' });
    });

    it('siren not valid', async () => {
      jest.spyOn(puppeteer, 'launch').mockImplementation(() => {
        return ({
          newPage: jest.fn().mockImplementation(() => {
            return {
              waitForNavigation: jest.fn().mockImplementation(() => {}),
              goto: jest.fn().mockImplementation(() => {}),
            };
          }),
        } as unknown) as any;
      });

      let error;

      try {
        await service.getData('12345678');
      } catch (e) {
        error = e;
      }
      expect(error.message).toBe('Siren invalid');
    });

    it('name company not found', async () => {
      jest.spyOn(puppeteer, 'launch').mockImplementation(() => {
        return ({
          newPage: jest.fn().mockImplementation(() => {
            return {
              waitForNavigation: jest.fn().mockImplementation(() => {}),
              goto: jest.fn().mockImplementation(() => {}),
              waitForTimeout: jest.fn().mockImplementation(() => {}),
              click: jest.fn().mockImplementation(() => {}),
              type: jest.fn().mockImplementation(() => {}),
              $: jest.fn().mockImplementation(() => {
                return false;
              }),
            };
          }),
        } as unknown) as any;
      });

      let error;

      try {
        await service.getData('123456789');
      } catch (e) {
        error = e;
      }
      expect(error.message).toBe('Name company not found');
    });

    it('number not found', async () => {
      jest.spyOn(puppeteer, 'launch').mockImplementation(() => {
        return ({
          newPage: jest.fn().mockImplementation(() => {
            return {
              waitForNavigation: jest.fn().mockImplementation(() => {}),
              goto: jest.fn().mockImplementation(() => {}),
              waitForTimeout: jest.fn().mockImplementation(() => {}),
              click: jest.fn().mockImplementation(() => {}),
              type: jest.fn().mockImplementation(() => {}),
              waitForSelector: jest.fn().mockImplementation(() => {}),
              $: jest.fn().mockImplementation(() => {
                return false;
              }),
              keyboard: {
                press: jest.fn().mockImplementation(() => {}),
              },
              $eval: jest.fn().mockImplementation(() => {
                return 'aaaa';
              }),
            };
          }),
        } as unknown) as any;
      });

      let error;

      try {
        await service.getData('aaaa');
      } catch (e) {
        error = e;
      }
      expect(error.message).toBe('Number not found');
    });

    it('company name different from address', async () => {
      jest.spyOn(puppeteer, 'launch').mockImplementation(() => {
        return ({
          newPage: jest.fn().mockImplementation(() => {
            return {
              waitForNavigation: jest.fn().mockImplementation(() => {}),
              goto: jest.fn().mockImplementation(() => {}),
              $: jest.fn().mockImplementation(() => {
                return true;
              }),
              waitForTimeout: jest.fn().mockImplementation(() => {}),
              click: jest.fn().mockImplementation(() => {}),
              type: jest.fn().mockImplementation(() => {}),
              evaluate: jest.fn().mockImplementation(() => {
                return false;
              }),
              waitForSelector: jest.fn().mockImplementation(() => {
                return true;
              }),
              $eval: jest.fn().mockImplementation(() => {
                return 'experdeco';
              }),
              keyboard: {
                press: jest.fn().mockImplementation(() => {}),
              },
            };
          }),
          close: jest.fn().mockImplementation(() => {}),
        } as unknown) as any;
      });

      let error;

      try {
        await service.getData('ccccc 70 Rte du Giffre, 74970 Marignier');
      } catch (e) {
        error = e;
      }
      expect(error.message).toBe('Company name different from address');
    });
  });
});
